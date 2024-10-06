import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prismaClient from "@/lib/prisma";
import youtubeMetaData from "youtube-meta-data"; // Use import instead of require

// YouTube URL regex pattern
const yt_Regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([a-zA-Z0-9_-]{11})$/;

// Schema to validate incoming requests for stream creation
const createStreamSchema = z.object({
  creatorId: z.string().min(1, "Creator ID is required"),
  url: z.string().min(1, "YouTube URL is required"),
});

// Handle POST request to add a new stream
export async function POST(req: NextRequest) {
  try {
    // Parse and validate incoming request data
    const data = createStreamSchema.parse(await req.json());

    // Check if URL is a valid YouTube URL
    const isYt = yt_Regex.test(data.url);
    if (!isYt) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 411 }
      );
    }

    // Extract YouTube video ID from URL
    const match = data.url.match(yt_Regex);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 411 }
      );
    }
    const extracted = match[5];

    // Fetch metadata using youtube-meta-data
    const info = await youtubeMetaData(data.url);
    if (!info || !info.embedinfo) {
      return NextResponse.json(
        { message: "Failed to fetch YouTube video metadata" },
        { status: 500 }
      );
    }

    // Extract title and thumbnail from metadata
    const { title, embedinfo } = info;
    const thumbnail = embedinfo.thumbnail_url || "";

    // Store stream data in the Stream table in your Prisma schema
    const newStream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId: extracted,
        type: "Youtube",
        title: title || "Unknown Title",
        thumbnail: thumbnail,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Stream created successfully", stream: newStream },
      { status: 201 }
    );
  } catch (e) {
    // Handle errors and send appropriate response
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation Error", errors: e.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Error while adding a stream",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

// Handle GET request to retrieve streams based on creatorId
export async function GET(req: NextRequest) {
  try {
    // Extract creatorId from query parameters
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    // Fetch streams from the database for the given creatorId
    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId ?? undefined, // Use undefined to avoid filtering by empty string
      },
    });

    // Return the fetched streams in the response
    return NextResponse.json(streams);
  } catch (error) {
    // Handle errors and send appropriate response
    return NextResponse.json(
      { message: "Error fetching streams", error: error.message },
      { status: 500 }
    );
  }
}

// Handler for API routes
export async function POST(req: NextRequest) {
  const { action, streamId }: { action: string; streamId: string } = await req.json();

  if (!streamId) {
    return new NextResponse("Stream ID is required", { status: 400 });
  }

  const userId = "USER_ID"; // Replace this with actual user ID from the session or authentication mechanism

  if (action === "upvote") {
    // Create an upvote record
    const upvote = await prisma.upvote.create({
      data: {
        userId,
        streamId,
      },
    });

    // Increment the vote count on the Stream model
    await prisma.stream.update({
      where: { id: streamId },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return new NextResponse(JSON.stringify(upvote), { status: 201 });
  } else if (action === "downvote") {
    // Check if the upvote exists
    const existingUpvote = await prisma.upvote.findFirst({
      where: {
        userId,
        streamId,
      },
    });

    if (!existingUpvote) {
      return new NextResponse("You haven't upvoted this stream yet", { status: 400 });
    }

    // Delete the upvote record
    await prisma.upvote.delete({
      where: {
        id: existingUpvote.id,
      },
    });

    // Decrement the vote count on the Stream model
    await prisma.stream.update({
      where: { id: streamId },
      data: {
        votes: {
          decrement: 1,
        },
      },
    });

    return new NextResponse(JSON.stringify({ message: "Downvoted successfully" }), { status: 200 });
  }

  return new NextResponse("Invalid action", { status: 400 });
}
