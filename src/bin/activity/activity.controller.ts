import { NextFunction, Response } from "express";
import { ActivityService } from "./activity.service";
import { CustomRequest } from "../../config/custom.config";

export class activityController {
    static async getUserComents(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const comments = await ActivityService.getUserComments(userId);
            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }

    static async getUserLikes(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const likes = await ActivityService.getUserLikes(userId);
            res.status(200).json(likes);
        } catch (error) {
            next(error);
        }
    }
}