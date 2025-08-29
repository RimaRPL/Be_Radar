import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { commentService } from "./comment.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { commentModel, getcommentModel } from "./comment.model";
import { ErrorHandler } from "../../config/custom.config";

export class CommentController {
  static async createComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.body as commentModel;
      const userId = req.user?.id!; // ambil dari JWT middleware

      // Tidak perlu cek lagi karena middleware sudah valid
      const response = await commentService.createComment(request, userId!);
      Wrapper.success(res, true, response, "Berhasil membuat komentar", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: commentModel = req.body as commentModel;
      const userId = req.user?.id;

      const response = await commentService.updateComment(request, userId!);
      Wrapper.success(res, true, response, "Berhasil memperbarui komentar", 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const commentId = req.params.id;
    const userId = req.user?.id; // Ambil dari JWT

    if (!userId) throw new ErrorHandler(401, "User harus login");

    const response = await commentService.deleteComment({ id: commentId }, userId);
    Wrapper.success(res, true, response, "Berhasil menghapus komentar", 200);
  } catch (error) {
    next(error);
  }
}


  static async getAllComments(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: getcommentModel = req.query as unknown as getcommentModel;
      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const response = await commentService.getComment(request);
      Wrapper.pagination(
        res,
        true,
        response.metaData,
        "Berhasil mendapatkan semua komentar",
        response.data,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
