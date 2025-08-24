import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🔗 Connecting to database...");

  // langsung pakai query Mongo mentah
  const result = await prisma.$runCommandRaw({
    delete: "News", // nama collection di DB
    deletes: [{ q: { region: null }, limit: 0 }]
  });

  console.log("✅ Deleted:", result);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
