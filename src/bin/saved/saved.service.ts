import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { CreateSavedNews, GetSavedNews } from "./saved.model";
import { SavedNewsSchema } from "./saved.schema";

export class SavedNewsService {
    // CREATE
    static async createSaved(req: CreateSavedNews, userId: string) {
        const ctx = "Create Saved News";
        const scp = "saved";

        const userRequest = Validator.Validate(SavedNewsSchema.CreateSavedNews, req);

        // pastikan newsId ada di tabel News
        const newsExist = await prisma.news.findUnique({
            where: { id: userRequest.newsId },
        });

        if (!newsExist) {
            loggerConfig.error(ctx, "News not found", scp);
            throw new ErrorHandler(404, "Berita tidak ditemukan");
        }

        // cek apakah sudah tersimpan
        const isSavedExist = await prisma.saved.findFirst({
            where: { newsId: userRequest.newsId, userId },
        });

        if (isSavedExist) {
            loggerConfig.error(ctx, "News already saved", scp);
            throw new ErrorHandler(409, "Berita sudah disimpan");
        }

        const create = await prisma.saved.create({
            data: { newsId: userRequest.newsId, userId },
            include: { news: true },
        });

        loggerConfig.info(ctx, "News saved successfully", scp);

        return {
            id: create.id,
            newsId: create.newsId,
            userId: create.userId,
            news: create.news,
        };
    }

    // GET LIST
    static async getSaved(req: GetSavedNews, userId: string) {
        const ctx = "Get Saved News";
        const scp = "saved";

        const userRequest = Validator.Validate(SavedNewsSchema.GetSavedNews, req);

        const whereFilter: any = {
            userId,
            savedAt: {
                gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
                lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
            },
        };

        if (userRequest.search) {
            whereFilter.news = {
                title: { contains: userRequest.search, mode: "insensitive" },
            };
        }

        const [result, totalItem] = await Promise.all([
            prisma.saved.findMany({
                where: whereFilter,
                orderBy: { savedAt: "desc" },
                skip: (userRequest.page - 1) * userRequest.quantity,
                take: userRequest.quantity,
                include: { news: true },
            }),
            prisma.saved.count({ where: whereFilter }),
        ]);

        if (!result.length) {
            loggerConfig.error(ctx, "No saved news found", scp);
            throw new ErrorHandler(404, "Belum ada berita tersimpan");
        }

        const metaData = {
            totalItem,
            totalPage: Math.ceil(totalItem / userRequest.quantity),
            currentPage: userRequest.page,
            quantity: userRequest.quantity,
        };

        loggerConfig.info(ctx, "Saved news retrieved successfully", scp);

        return {
            data: result.map((item) => ({
                id: item.id,
                newsId: item.newsId,
                userId: item.userId,
                news: {
                    id: item.news.id,
                    image: item.news.image ? item.news.image.replace(/\\/g, "/").replace(/^public\//, ""): null,
                    pdfUrl: item.news.pdfUrl.map((url) => url.replace(/\\/g, "/").replace(/^public\//, "")),
                    publishedAt: item.news.publishedAt,
                    createdAt: item.news.created_at, // ⚡️ pastikan pake createdAt yang benar
                    region: item.news.region,
                }, // sudah termasuk detail image, title, dsb
            })),
            metaData,
        };
    }

    // DELETE
    static async deleteSaved(id: string, userId: string) {
        const ctx = "Delete Saved News";
        const scp = "saved";

        const isSavedExist = await prisma.saved.findFirst({ where: { id, userId } });

        if (!isSavedExist) {
            loggerConfig.error(ctx, "Saved news not found or unauthorized", scp);
            throw new ErrorHandler(404, "Berita tidak ditemukan atau bukan milik user");
        }

        await prisma.saved.delete({ where: { id } });

        loggerConfig.info(ctx, "Saved news deleted successfully", scp);

        return { message: "Berita berhasil dihapus" };
    }
}
