import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { deleteNews, getNews } from "../news/news.model";
import { CreateSavedNews } from "./saved.model";
import { SavedNewsSchema } from "./saved.schema";

export class SavedNewsService {
    static async createSaved(req: CreateSavedNews, userId: string) {
        const ctx = "Create Saved News";
        const scp = "saved"

        const userRequest = Validator.Validate(SavedNewsSchema.CreateSavedNews, req);

        const isSavedExist = await prisma.saved.count({
            where: {
                newsId: userRequest.newsId,
                userId: userId,
            },
        });

        if (isSavedExist !== 0) {
            loggerConfig.error(ctx, "News already exists", scp);
            throw new ErrorHandler(409, "News sudah tersedia");
        }

        const create = await prisma.saved.create({
            data: {
                newsId: userRequest.newsId,
                userId: userId,
            }
        });

        loggerConfig.info(ctx, "News created successfully", scp);

        return {
            id: create.id,
            newsId: create.newsId,
            userId: create.userId
        };
    }

    static async getSaved(req: getNews) {
        const ctx = "Get Saved News";
        const scp = "saved"
        const userRequest = Validator.Validate(SavedNewsSchema.GetSavedNews, req);

        const filter = {
            ...(userRequest.search && {
                name: {
                    contains: userRequest.search,
                },
            }),
            created_at: {
                gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
                lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
            },
        };

        const [result, totalItem] = await Promise.all([
            prisma.saved.findMany({
                where: {
                    ...(userRequest.search && {
                        news: {
                            // Misalnya kamu ingin cari dari judul atau nama di `news`
                            image: {
                                contains: userRequest.search,
                                mode: 'insensitive'
                            }
                        }
                    }),
                    savedAt: {
                        gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
                        lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
                    },
                    userId: userRequest.userId
                },
                orderBy: {
                    savedAt: "desc"
                },
                skip: (userRequest.page - 1) * userRequest.quantity,
                take: userRequest.quantity,
                include: {
                    news: true // jika ingin ambil detail news
                }
            }),
            prisma.saved.count({
                where: {
                    ...(userRequest.search && {
                        news: {
                            image: {
                                contains: userRequest.search,
                                mode: 'insensitive'
                            }
                        }
                    }),
                    savedAt: {
                        gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
                        lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
                    },
                    userId: userRequest.userId
                }
            })
        ]);


        if (result.length === 0) {
            loggerConfig.error(ctx, "news not found", scp);
            throw new ErrorHandler(404, "news tidak ditemukan");
        }

        const metaData = {
            totalItem,
            totalPage: Math.ceil(totalItem / userRequest.quantity),
            currentPage: userRequest.page,
            quantity: userRequest.quantity,
        }

        loggerConfig.info(ctx, "news retrieved successfully", scp);

        return {
            data: result.map((item) => ({
                id: item.id,
                newsId: item.newsId,
                userId: item.userId,
            })),
            metaData
        }

    }

    static async deleteSaved(req: deleteNews) {
        const ctx = "Delete Saved News";
        const scp = "saved";

        const userRequest = Validator.Validate(SavedNewsSchema.DeleteSavedNews, req);

        const isSavedExist = await prisma.saved.findFirst({
            where: {
                id: userRequest.id,
            },
        });

        if (!isSavedExist) {
            loggerConfig.error(ctx, "Saved news not found", scp);
            throw new ErrorHandler(404, "Saved news tidak ditemukan");
        }

        await prisma.saved.delete({
            where: {
                id: userRequest.id,
            },
        });

        loggerConfig.info(ctx, "Saved news deleted successfully", scp);

        return {};
    }
}
