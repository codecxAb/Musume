import { hash } from "bcryptjs";
import { prismaClient } from "@/lib/prisma"; // Adjust your import path

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Hash the password before saving it to the database
    const hashedPassword = await hash(password, 12);

    // Save the new user to the database using Prisma
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({ success: true, user }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
