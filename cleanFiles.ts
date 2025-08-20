import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

// Config MongoDB
const MONGO_URI = "mongodb+srv://Radar_Apps:sMbGOTI7bGrMWOsE@cluster0.olyyqhw.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Cluster0";
const COLLECTION_NAME = "News";

// Folder tempat file disimpan
const NEWS_FOLDER = path.resolve("public", "news");

// Tipe data berita
interface News {
    image?: string;
    pdfUrl?: string[];
}

async function cleanFiles() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection<News>(COLLECTION_NAME);

        const newsList = await collection.find({}).toArray();
        console.log(`Total berita: ${newsList.length}`);

        // Kumpulkan semua file yang tercatat di DB
        const dbFiles = new Set<string>();

        newsList.forEach(news => {
            if (news.image) dbFiles.add(path.basename(news.image));

            // Pastikan pdfUrl itu array sebelum forEach
            if (news.pdfUrl) {
                if (Array.isArray(news.pdfUrl)) {
                    news.pdfUrl.forEach(pdf => dbFiles.add(path.basename(pdf)));
                } else if (typeof news.pdfUrl === "string") {
                    dbFiles.add(path.basename(news.pdfUrl));
                }
            }
        });
        // Baca semua file di folder news
        const allFiles = fs.readdirSync(NEWS_FOLDER);

        allFiles.forEach(file => {
            const fullPath = path.join(NEWS_FOLDER, file);
            if (!dbFiles.has(file)) {
                fs.unlinkSync(fullPath);
                console.log(`🗑️  File dihapus: ${file}`);
            } else {
                console.log(`✅ File ada di DB: ${file}`);
            }
        });

        console.log("✅ Pembersihan folder selesai!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

// Jalankan
cleanFiles();
