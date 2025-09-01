import { NextFunction, Response } from "express";
import { ActivityService } from "./activity.service";
import { CustomRequest } from "../../config/custom.config";

export class activityController {
  static async getUserComents(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const comments = await ActivityService.getUserComments(userId);

      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserLikes(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const likes = await ActivityService.getUserLikes(userId);

      res.status(200).json({
        success: true,
        count: likes.length,
        data: likes,
      });
    } catch (error) {
      next(error);
    }
  }
}
