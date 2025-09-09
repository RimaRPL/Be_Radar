import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { LikeModel } from "./like.model";
import { LikeSchema } from "./like.schema";
import { CustomRequest } from "../../config/custom.config";

export class LikeService {
  static async likeNews(req: CustomRequest) {
    const ctx = "likeNews";
    const scp = "like";

    const userId = req.user?.id;
    if (!userId) {
      loggerConfig.error(ctx, "User ID is missing from token", scp);
      throw new Error("User ID is missing from token");
    }

    const payload = Validator.Validate(
      LikeSchema.likeNews,
      req.body as LikeModel
    );

    // cek sudah like belum
    const existingLike = await prisma.like.findFirst({
      where: {
        newsId: payload.newsId,
        userId: userId,
      },
    });

    if (existingLike) {
      // sudah like → hapus (unlike)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      // hitung ulang jumlah like
      const count = await prisma.like.count({
        where: { newsId: payload.newsId },
      });

      return {
        message: "Berhasil unlike berita",
        status: 200,
        liked: false,
        likesCount: count,
      };
    }

    // belum like → buat like
    await prisma.like.create({
      data: {
        newsId: payload.newsId,
        userId: userId,
      },
    });

    loggerConfig.info(ctx, "Like created successfully", scp);

    const count = await prisma.like.count({
      where: { newsId: payload.newsId },
    });

    return {
      message: "Berhasil like berita",
      status: 200,
      liked: true,
      likesCount: count,
    };
  }

  static async getLikes(req: CustomRequest) {
    const ctx = "getLikes";
    const scp = "like";

    const userId = req.user?.id;
    if (!userId) {
      loggerConfig.error(ctx, "User ID is missing from token", scp);
      throw new Error("User ID is missing from token");
    }

    const newsId = req.params.id;

    // hitung jumlah like
    const [count, existingLike] = await Promise.all([
      prisma.like.count({ where: { newsId } }),
      prisma.like.findFirst({ where: { newsId, userId } }),
    ]);

    return {
      message: "Get likes success",
      status: 200,
      likesCount: count,
      likedByUser: !!existingLike,
    };
  }
}
