import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { Wrapper } from "../../utils/wrapper.utils";
import { LikeService } from "./like.service";

export class LikeController {
    static async likeNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await LikeService.likeNews(req);
            Wrapper.success(res, true, response, response.message, response.status);
        } catch (error) {
            next(error);
        }
    }

    static async getLikes(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await LikeService.getLikes(req);
      Wrapper.success(res, true, response, response.message, response.status);
    } catch (error) {
      next(error);
    }
  }
}
