import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { LikeModel } from "./like.model";
import { Wrapper } from "../../utils/wrapper.utils";
import { LikeService } from "./like.service";

export class LikeController {
    static async likeNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.body as LikeModel;
            const userId = req.user?.id;

            if(!userId){
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const response = await LikeService.likeNews(request, userId);
            Wrapper.success(res, true, response, "Berhasil like berita", 200);
        } catch (error) {
            next(error);
        }
    }
}