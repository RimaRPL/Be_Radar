import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { commentModel, deleteModel, getcommentModel } from "./comment.model";
import { CommentSchema } from "./comment.schema";

import Filter from "bad-words";
const filter = new Filter();

export class commentService {
 static async createComment(req: commentModel, userId: string) {
  const ctx = "Create Comment";
  const scp = "Comment";

  // Validasi hanya newsId & content
  const userRequest = Validator.Validate(CommentSchema.comment, req);

  if (!userId) {
    throw new ErrorHandler(401, "User ID is required");
  }

  //  userId dari middleware JWT
  const create = await prisma.comment.create({
    data: {
      newsId: userRequest.newsId,
      content: filter.clean(userRequest.content),
      userId, // Prisma butuh userId
    },
  });

  loggerConfig.info(ctx, "Comment created successfully", scp);

  return {
    success: true,
    data: {
      id: create.id,
      newsId: create.newsId,
      content: create.content,
      userId: create.userId,
    },
  };
}

  static async updateComment(req: commentModel, userId: string) {
    const ctx = "Update Comment";
    const scp = "Comment";
    const userRequest = Validator.Validate(CommentSchema.updateComment, req);

    await prisma.comment.update({
      where: { id: userRequest.id },
      data: {
        newsId: userRequest.newsId,
        content: filter.clean(userRequest.content),
      },
    });

    loggerConfig.info(ctx, "Comment updated successfully", scp);
    return { success: true, message: "Berhasil Update Komentar" };
  }

  static async deleteComment(req: deleteModel, userId: string) {
  const ctx = "Delete Comment";
  const scp = "Comment";

  const userRequest = Validator.Validate(CommentSchema.deleteComment, req);

  // Cek apakah komentar ada
  const comment = await prisma.comment.findFirst({
    where: { id: userRequest.id },
  });

  if (!comment) {
    loggerConfig.error(ctx, "Comment not found", scp);
    throw new ErrorHandler(404, "Komentar tidak ditemukan");
  }

  // Cek kepemilikan user
  if (comment.userId !== userId) {
    loggerConfig.error(ctx, "Unauthorized delete attempt", scp);
    throw new ErrorHandler(403, "Anda tidak memiliki hak untuk menghapus komentar ini");
  }

  await prisma.comment.delete({
    where: { id: userRequest.id },
  });

  loggerConfig.info(ctx, "Comment deleted successfully", scp);
  return { success: true };
}

  static async getComment(req: getcommentModel) {
    const ctx = "Get Comment";
    const scp = "Comment";
    const userRequest = Validator.Validate(CommentSchema.getcomment, req);

    const filterWhere: any = {
      ...(userRequest.search && {
        content: { contains: userRequest.search },
      }),
      ...(userRequest.periode && {
        created_at: {
          gte: new Date(`${userRequest.periode}-01-01T00:00:00.000Z`),
          lte: new Date(`${userRequest.periode}-12-31T23:59:59.999Z`),
        },
      }),
      ...(userRequest.newsId && { newsId: userRequest.newsId }),
    };

    const [result, totalItem] = await Promise.all([
      prisma.comment.findMany({
        where: filterWhere,
        orderBy: { created_at: "desc" },
        skip: (userRequest.page - 1) * userRequest.quantity,
        take: userRequest.quantity,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,  // <--- tambahkan ini
            },
          },
        },
      }),
      prisma.comment.count({ where: filterWhere }),
    ]);

    // JANGAN lempar 404 kalau kosong — biar frontend tetap dapat JSON valid
    const metaData = {
      totalItem,
      currentPage: userRequest.page,
      quantity: userRequest.quantity,
      totalPages: Math.ceil(totalItem / userRequest.quantity),
    };

    loggerConfig.info(ctx, `Get All Comment Success`, scp);

    return {
      success: true,
      data: result,
      metaData,
    };
  }
}
