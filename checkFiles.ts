import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

// Ganti dengan URL MongoDB kamu
const MONGO_URI = "mongodb+srv://Radar_Apps:sMbGOTI7bGrMWOsE@cluster0.olyyqhw.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Cluster0";
const COLLECTION_NAME = "News";

async function checkFiles() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const newsList = await collection.find({}).toArray();

    console.log(`Total berita: ${newsList.length}`);

    newsList.forEach((news) => {
      // Cek gambar
      if (news.image) {
        const imgPath = path.resolve("public", news.image);
        if (fs.existsSync(imgPath)) {
          console.log(`✅ Gambar ada: ${news.image}`);
        } else {
          console.log(`❌ Gambar hilang: ${news.image}`);
        }
      }

      // Cek PDF
      if (news.pdfUrl && Array.isArray(news.pdfUrl)) {
        news.pdfUrl.forEach((pdf: string) => {
          const pdfPath = path.resolve("public", pdf);
          if (fs.existsSync(pdfPath)) {
            console.log(`✅ PDF ada: ${pdf}`);
          } else {
            console.log(`❌ PDF hilang: ${pdf}`);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkFiles();
