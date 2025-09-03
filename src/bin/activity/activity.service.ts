import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config"

export class ActivityService {
    static async getUserComments(userId: string) {
        const ctx = "comment service"
        const scp = "getUserComments"

        const comment = await prisma.comment.findMany({
            where: {
                userId,
                news: {
                    onDelete: false   // filter comment di berita yang belum di hapus 
                }
            },
            orderBy: { created_at: "desc" },
            include: {
                news: {
                    select: {
                        id: true,
                        publishedAt: true,
                        image: true,
                    },
                },
            },
        });

        loggerConfig.info(ctx, scp, "Successfully retrieved user comments");

        return comment.map(item => ({
            id: item.id,
            newsId: item.newsId,
            content: item.content,
            createdAt: item.created_at,
            news: {
                id: item.news.id,
                publishedAt: item.news.publishedAt,
                image: item.news.image,
            },
        }));
    }

    static async getUserLikes(userId: string) {
        const ctx = "like service"
        const scp = "getUserLikes"

        const likes = await prisma.like.findMany({
            where: {
                userId,
                news: { onDelete: false }, // hanya ambil like dari news aktif
            },
            orderBy: { likedAt: "desc" },
            include: {
                news: {
                    select: {
                        id: true,
                        publishedAt: true,
                        image: true,
                    },
                },
            },
        });

        loggerConfig.info(ctx, scp, "Successfully retrieved user likes");

        return likes.map(item => ({
            id: item.id,
            newsId: item.newsId,
            likedAt: item.likedAt,
            news: {
                id: item.news.id,
                publishedAt: item.news.publishedAt,
                image: item.news.image,
            },
        }));
    }
}