import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function fileExists(filePath: string): boolean {
  // ubah \ jadi / lalu normalize biar cross-platform
  const normalized = path.normalize(filePath.replace(/\\/g, "/"));
  const absolute = path.resolve(normalized);
  return fs.existsSync(absolute);
}

async function main() {
  const allNews = await prisma.news.findMany({
    select: {
      id: true,
      image: true,
      pdfUrl: true,
      onDelete: true,
      created_at: true,
    },
  });

  console.log(`\n📊 Total berita: ${allNews.length}\n`);

  for (const news of allNews) {
    console.log(`📰 Cek News id=${news.id}`);
    if (news.onDelete !== undefined) {
      console.log(`✅ Field 'onDelete' ada (value: ${news.onDelete})`);
    } else {
      console.log("⚠️ Field 'onDelete' tidak ada");
    }

    // cek image
    if (news.image) {
      if (fileExists(news.image)) {
        console.log(`✅ Gambar ada: ${news.image}`);
      } else {
        console.log(`❌ Gambar hilang: ${news.image}`);
      }
    }

    // cek pdf (array)
    if (news.pdfUrl && Array.isArray(news.pdfUrl)) {
      for (const pdf of news.pdfUrl) {
        if (fileExists(pdf)) {
          console.log(`✅ PDF ada: ${pdf}`);
        } else {
          console.log(`❌ PDF hilang: ${pdf}`);
        }
      }
    }

    console.log("----");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
