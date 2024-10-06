import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Access the DATABASE_URL environment variable
    },
  },
});

// Export the Prisma Client
export default prismaClient;
