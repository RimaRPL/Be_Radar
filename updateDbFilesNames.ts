import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

function normalizeFileName(file: string): string {
    let newName = decodeURIComponent(file); // decode %20
    newName = newName.replace(/\s+/g, "_"); // ganti spasi
    newName = newName.replace(/halaaman/gi, "halaman"); // perbaiki typo
    return newName;
}

async function main() {
    const news = await prisma.news.findMany({
        where: { pdfUrl: { isEmpty: false } },
    });

    for (const item of news) {
        if (!item.pdfUrl) continue;

        const updatedUrls = item.pdfUrl.map((url) => {
            const filename = path.basename(url);
            const fixed = normalizeFileName(filename);
            return url.replace(filename, fixed);
        });

        await prisma.news.update({
            where: { id: item.id },
            data: { pdfUrl: updatedUrls },
        });

        console.log(`✅ Update DB News ID: ${item.id}`);
    }
}

main()
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect());
