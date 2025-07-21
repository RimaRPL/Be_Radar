import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { LikeModel } from "./like.model";
import { LikeSchema } from "./like.schema";

export class LikeService {
    static async likeNews(req: LikeModel, userId: string) {
        const ctx = "likeNews";
        const scp = "like";

        const userRequest = Validator.Validate(LikeSchema.likeNews, req);

        const existingLike = await prisma.like.findFirst({
            where: {
                newsId: userRequest.newsId,
                userId: userId
            },
        });

        if(existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                },
            });
            return {message: "Berhasil unlike berita", status: 200};
        }

        await prisma.like.create({
            data: {
                newsId: userRequest.newsId,
                userId: userId
            },
        });

        loggerConfig.info(ctx, "Like created successfully", scp);

        return {message: "Berhasil like berita", status: 200};
    }
}