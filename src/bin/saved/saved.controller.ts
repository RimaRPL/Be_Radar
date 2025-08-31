import { NextFunction, Response } from "express";
import { CustomRequest } from "../../config/custom.config";
import { CreateSavedNews, GetSavedNews } from "./saved.model";
import { SavedNewsService } from "./saved.service";
import { Wrapper } from "../../utils/wrapper.utils";

export class savedController {
  // CREATE
  static async createSaved(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.body as CreateSavedNews;
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const response = await SavedNewsService.createSaved(request, userId);
      Wrapper.success(res, true, response, "Success create saved", 201);
    } catch (error) {
      next(error);
    }
  }

  // GET LIST
  static async getSaved(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: GetSavedNews = req.query as unknown as GetSavedNews;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const response = await SavedNewsService.getSaved(request, userId);

      Wrapper.pagination(res, true, response.metaData, "Success get saved", response.data, 200);
    } catch (error) {
      next(error);
    }
  }

  // DELETE
  static async deleteSaved(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const response = await SavedNewsService.deleteSaved(requestId, userId);
      Wrapper.success(res, true, response, "Success delete saved", 200);
    } catch (error) {
      next(error);
    }
  }
}
