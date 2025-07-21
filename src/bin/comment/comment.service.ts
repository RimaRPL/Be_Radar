import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { filterProfanity } from "../../utils/filterProfanity";
import { Validator } from "../../utils/validator.utils";
import { commentModel, deleteModel, getcommentModel } from "./comment.model";

import { CommentSchema } from "./comment.schema";
import { Filter } from "bad-words";
const filter = new Filter();

export class commentService {
    static async createComment(req: commentModel, userId: string) {
        const ctx = "Create Comment";
        const scp = "Comment"

        const userRequest = Validator.Validate(CommentSchema.comment, req)

        filterProfanity(userRequest.content)
        if (filter.isProfane(userRequest.content)) {
            throw new ErrorHandler(400, "Komentar mengandung kata tidak pantas");
        }

        const create = await prisma.comment.create({
            data: {
                newsId: userRequest.newsId,
                content: userRequest.content,
                userId: userId
            }
        });
        loggerConfig.info(ctx, "Comment created successfully", scp);

        return {
            id: create.id,
            newsId: create.newsId,
            content: create.content,
            userId: create.userId
        };
    }

    static async updateComment(req: commentModel, userId: string) {
        const ctx = "Update Comment";
        const scp = "Comment"
        const userRequest = Validator.Validate(CommentSchema.updateComment, req)

        await prisma.comment.update({
            where: {
                id: userRequest.id,
            },
            data: {
                newsId: userRequest.newsId,
                content: userRequest.content,
            }
        });

        return {
            message: "Berhasil Update Komentar"
        }
    }

    static async deleteComment(req: deleteModel) {
        const ctx = "Delete Comment";
        const scp = "Comment"

        const userRequest = Validator.Validate(CommentSchema.deleteComment, req)

        const isSavedExist = await prisma.comment.findFirst({
            where: {
                id: userRequest.id,
            },
        });

        if (!isSavedExist) {
            loggerConfig.error(ctx, "Comment not found", scp);
            throw new ErrorHandler(404, "Comment tidak ditemukan");
        }

        await prisma.comment.delete({
            where: {
                id: userRequest.id,
            },
        });

        loggerConfig.info(ctx, "Comment deleted successfully", scp);

        return {}
    }

    static async getComment(req: getcommentModel) {
        const ctx = "Get Comment";
        const scp = "Comment"
        const userRequest = Validator.Validate(CommentSchema.getcomment, req)

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
            prisma.comment.findMany({
                where: filter,
                orderBy: {
                    created_at: "desc",
                },
                skip: (userRequest.page - 1) * userRequest.quantity,
                take: userRequest.quantity,
            }),
            prisma.comment.count({
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

        loggerConfig.info(ctx, `Get All Comment Success`, scp)

        return {
            data: result,
            metaData
        }
    }
}