import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // === 1. Ambil semua data di DB (tanpa filter) ===
  const allNews = await prisma.news.findMany({
    orderBy: { created_at: "desc" },
    select: { id: true, region: true, onDelete: true, created_at: true },
  });

  console.log("📌 Total data di DB:", allNews.length);

  // === 2. Ambil data yang dipakai API getAllNews ===
  const periode = 2025; // contoh: FE kirim periode 2025
  const region: string | null = null; // contoh: FE tidak filter region

  const filter: any = {
    onDelete: false,
    ...(region ? { region } : {}),
    created_at: {
      gte: new Date(`${periode}-01-01T00:00:00.000Z`),
      lte: new Date(`${periode}-12-31T23:59:59.999Z`),
    },
  };

  const apiNews = await prisma.news.findMany({
    where: filter,
    orderBy: { created_at: "desc" },
    select: { id: true, region: true, onDelete: true, created_at: true },
  });

  console.log("📌 Total data keluar API:", apiNews.length);

  // === 3. Cari data yg ada di DB tapi ga muncul di API ===
  const apiIds = new Set(apiNews.map((n) => n.id));
  const hiddenNews = allNews.filter((n) => !apiIds.has(n.id));

  console.log("🚨 Data yang ada di DB tapi tidak muncul di API:");
  console.table(hiddenNews);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
