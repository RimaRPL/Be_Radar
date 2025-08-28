import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

// Config MongoDB
const MONGO_URI =
  "mongodb+srv://Radar_Apps:sMbGOTI7bGrMWOsE@cluster0.olyyqhw.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Cluster0";
const COLLECTION_NAME = "News";

// Folder tempat file disimpan
const NEWS_FOLDER = path.resolve("public", "news");

// Tipe data berita
interface News {
  image?: string;
  pdfUrl?: string[];
  onDeleted?: boolean;
}

async function cleanFiles() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection<News>(COLLECTION_NAME);

    // Ambil berita yang aktif saja
    const newsList = await collection
      .find({ $or: [{ onDeleted: false }, { onDeleted: { $exists: false } }] })
      .toArray();
    console.log(`Total berita aktif: ${newsList.length}`);

    // Kumpulkan semua file yang tercatat di DB
    const dbFiles = new Set<string>();
    newsList.forEach((news) => {
      if (news.image) dbFiles.add(path.basename(news.image));
      if (news.pdfUrl) {
        if (Array.isArray(news.pdfUrl)) {
          news.pdfUrl.forEach((pdf) => dbFiles.add(path.basename(pdf)));
        } else if (typeof news.pdfUrl === "string") {
          dbFiles.add(path.basename(news.pdfUrl));
        }
      }
    });

    // Fungsi rekursif untuk bersihkan folder
    function cleanFolder(folderPath: string) {
      const entries = fs.readdirSync(folderPath);
      entries.forEach((entry) => {
        const fullPath = path.join(folderPath, entry);
        const stats = fs.lstatSync(fullPath);

        if (stats.isFile()) {
          if (!dbFiles.has(entry)) {
            fs.unlinkSync(fullPath);
            console.log(`✅ File orphan dihapus: ${fullPath}`);
          } else {
            console.log(`📌 File ada di DB, tidak dihapus: ${fullPath}`);
          }
        } else if (stats.isDirectory()) {
          console.log(`📂 Memeriksa folder: ${fullPath}`);
          // Rekursif masuk ke subfolder
          cleanFolder(fullPath);
        }
      });
    }

    cleanFolder(NEWS_FOLDER);
    console.log("✅ Pembersihan folder selesai!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

// Jalankan
cleanFiles();
