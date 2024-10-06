// app/api/streams/downvote/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Import the Prisma client

export async function POST(req: Request) {
  const { streamId, userId } = await req.json(); // Parse the request body

  if (!streamId || !userId) {
    return NextResponse.json(
      { error: "Stream ID and User ID are required" },
      { status: 400 }
    );
  }

  try {
    // Find the user's existing upvote
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId,
          streamId,
        },
      },
    });

    if (!existingUpvote) {
      return NextResponse.json(
        { message: "User has not upvoted this stream" },
        { status: 400 }
      );
    }

    // Delete the upvote record
    await prisma.upvote.delete({
      where: {
        id: existingUpvote.id,
      },
    });

    // Decrement the votes for the specified stream
    const updatedStream = await prisma.stream.update({
      where: { id: streamId },
      data: {
        votes: {
          decrement: 1, // Decrement the vote count by 1
        },
      },
    });

    return NextResponse.json(updatedStream); // Respond with the updated stream data
  } catch (error) {
    console.error("Error in downvote API:", error); // Log error details
    return NextResponse.json({ error: "Failed to downvote" }, { status: 500 });
  }
}
