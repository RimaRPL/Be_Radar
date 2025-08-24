import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Mulai migrasi...");

  // update semua dokumen yang belum ada onDelete jadi false
  const result = await prisma.news.updateMany({
    where: {
      OR: [
        { onDelete: null },          // kalau null
        { onDelete: undefined as any } // kalau undefined
      ]
    },
    data: {
      onDelete: false,
    },
  });

  console.log(`✅ Migrasi selesai. ${result.count} dokumen diperbarui.`);
}

main()
  .catch((e) => {
    console.error("❌ Error migrasi:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
