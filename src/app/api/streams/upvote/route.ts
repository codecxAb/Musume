// app/api/streams/upvote/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client

export async function POST(req: Request) {
  const { streamId, userId } = await req.json(); // Parse the request body

  if (!streamId || !userId) {
    return NextResponse.json({ error: "Stream ID and User ID are required" }, { status: 400 });
  }

  try {
    // Check if the user has already upvoted the stream
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId,
          streamId,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json({ message: "User has already upvoted this stream" }, { status: 400 });
    }

    // Create a new upvote record
    await prisma.upvote.create({
      data: {
        userId,
        streamId,
      },
    });

    // Increment the votes for the specified stream
    const updatedStream = await prisma.stream.update({
      where: { id: streamId },
      data: {
        votes: {
          increment: 1, // Increment the vote count by 1
        },
      },
    });

    return NextResponse.json(updatedStream); // Respond with the updated stream data
  } catch (error) {
    console.error("Error in upvote API:", error); // Log error details
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
