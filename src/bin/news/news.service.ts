import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { Validator } from "../../utils/validator.utils";
import { CreateNewsRequest, deleteNews, getNews, getNewsById, UpdateNewsRequest } from "./news.model";
import { newsSchema } from "./news.schema";

export class NewsService {
    static async createNews(req: CreateNewsRequest) {
        const ctx = "Create News"
        const scp = "Product"

        const userRequest = Validator.Validate(newsSchema.createNews, req);

        const isNewsExist = await prisma.news.count({
            where: {
                OR: [{ pdfUrl: userRequest.pdfUrl }]
            },
        });

        if (isNewsExist !== 0) {
            loggerConfig.error(ctx, "News already post");
            throw new ErrorHandler(409, "News sudah terbit");
        }

        const create = await prisma.news.create({
            data: {
                image: userRequest.image,
                pdfUrl: userRequest.pdfUrl,
                publishedAt: userRequest.publishedAt,
            }
        });

        loggerConfig.info(ctx, `Create News Success`, scp)

        return create;
    }

    static async updateNews(req: UpdateNewsRequest) {
        const ctx = "Update News"
        const scp = "Product"

        const userRequest = Validator.Validate(newsSchema.updateNews, req);

        const isNewsExist = await prisma.news.findFirst({
            where: {
                id: userRequest.id,
            }
        });

        if (!isNewsExist) {
            loggerConfig.error(ctx, "News not found");
            throw new ErrorHandler(404, "Berita tidak ditemukan");
        }

        userRequest.image = userRequest.image || isNewsExist.image;
        userRequest.pdfUrl = userRequest.pdfUrl || isNewsExist.pdfUrl;

        await prisma.news.update({
            where: {
                id: userRequest.id,
            },
            data: {
                image: userRequest.image,
                pdfUrl: userRequest.pdfUrl,
            }
        });

        if (userRequest.image !== isNewsExist.image) {
            removeFileIfExists(isNewsExist.image);
        }

        return {
            message: "Berhasil memperbarui berita",
            updated_at: new Date(),
        }
    }

    static async getNewsById(req: getNewsById) {
        const ctx = "Get News By Id"
        const scp = "Product"

        const userRequest = Validator.Validate(newsSchema.getnewsbyid, req);

        const isNewsExist = await prisma.news.findFirst({
            where: {
                id: userRequest.id,
            }
        });

        if (!isNewsExist) {
            loggerConfig.error(ctx, "News not found");
            throw new ErrorHandler(404, "Berita tidak ditemukan");
        }

        return {
            id: isNewsExist.id,
            image: isNewsExist.image,
            pdfUrl: isNewsExist.pdfUrl,
            publishedAt: isNewsExist.publishedAt,
        }
    }

    static async getAllNews(req: getNews) {
        const ctx = "Get All News"
        const scp = "Product"

        const userRequest = Validator.Validate(newsSchema.getallnews, req);

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
        }

        const [result, totalItem] = await Promise.all([
            prisma.news.findMany({
                where: filter,
                orderBy: {
                    created_at: "desc",
                },
                skip: (userRequest.page - 1) * userRequest.quantity,
                take: userRequest.quantity,
            }),
            prisma.news.count({
                where: filter,
            }),
        ])

        if (result.length === 0) {
            loggerConfig.error(ctx, "News not found");
            throw new ErrorHandler(404, "Berita tidak ditemukan");
        }


        const metaData = {
            totalItem,
            currentPage: userRequest.page,
            quantity: userRequest.quantity,
            totalPages: Math.ceil(totalItem / userRequest.quantity),
        }

        loggerConfig.info(ctx, `Get All News Success`, scp)

        return {
            data: result,
            meta: metaData,
        }
    }

    static async deleteNews(req: deleteNews) {
        const ctx = "Delete News"
        const scp = "Product"

        const userRequest = Validator.Validate(newsSchema.deletenews, req);

        const isNewsExist = await prisma.news.findFirst({
            where: {
                id: userRequest.id,
            }
        });

        if (!isNewsExist) {
            loggerConfig.error(ctx, "News not found");
            throw new ErrorHandler(404, "Berita tidak ditemukan");
        }

        await prisma.news.delete({
            where: {
                id: userRequest.id,
            }
        })

        removeFileIfExists(isNewsExist.image);

        loggerConfig.info(ctx, `Delete News Success`, scp)

        return {
            message: "Berhasil menghapus berita",
            deleted_at: new Date(),
        }
    }
}