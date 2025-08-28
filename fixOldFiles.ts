import fs from "fs";
import path from "path";

const NEWS_DIR = path.resolve("public/news");

function normalizeFileName(file: string): string {
  let newName = decodeURIComponent(file); // decode %20, dll

  // ubah spasi jadi underscore
  newName = newName.replace(/\s+/g, "_");

  // perbaiki typo
  newName = newName.replace(/halaaman/gi, "halaman");

  return newName;
}

async function main() {
  const files = fs.readdirSync(NEWS_DIR);

  for (const file of files) {
    const oldPath = path.join(NEWS_DIR, file);
    const newName = normalizeFileName(file);
    const newPath = path.join(NEWS_DIR, newName);

    if (oldPath !== newPath) {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Rename: ${file} → ${newName}`);
      } catch (err) {
        console.error(`❌ Gagal rename ${file}:`, err);
      }
    }
  }
}

main().catch(console.error);
