import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { CreateNewsRequest, getNews, UpdateNewsRequest } from "./news.model";
import { NewsService } from "./news.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { removeFileIfExists } from "../../helper/delete.file.helper";

export class NewsController {
  static async createNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as {
        image?: Express.Multer.File[];
        pdfUrl?: Express.Multer.File[];
      };

      if (!files || !files.image?.length || !files.pdfUrl?.length) {
        throw new ErrorHandler(400, "Harap unggah image dan PDF.");
      }

      const request: CreateNewsRequest = {
        image: files.image[0].path,
        pdfUrl: files.pdfUrl[0].path,
        publishedAt: new Date(),
      };

      const response = await NewsService.createNews(request);
      Wrapper.success(res, true, response, "Berhasil membuat berita", 200);
    } catch (error) {
      // Hapus file jika error
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        for (const field of Object.keys(files)) {
          for (const file of files[field]) {
            removeFileIfExists(`public/news/${file.filename}`);
          }
        }
      }
      next(error);
    }
  }

  static async updateNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: UpdateNewsRequest = req.body as UpdateNewsRequest;

      const response = await NewsService.updateNews(request);
      Wrapper.success(res, true, response, "Berhasil memperbarui berita", 200)
    } catch (error) {
      if (req.body.originalname)
        removeFileIfExists(`product/${req.body.originalname}`);
      next(error);
    }
  }

  static async getNewsById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.params.id;

      const response = await NewsService.getNewsById({ id: request });
      Wrapper.success(res, true, response, "Berhasil mendapatkan berita", 200);
    } catch (error) {
      next(error);
    }
  }

  static async getAllNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: getNews = req.query as unknown as getNews;

      request.periode = Number(request.periode);
      request.page = Number(request.page);
      request.quantity = Number(request.quantity);

      const response = await NewsService.getAllNews(request);
      Wrapper.success(res, true, response, "Berhasil mendapatkan semua berita", 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteNews(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = req.params.id

      const response = await NewsService.deleteNews({ id: request });
      Wrapper.success(res, true, response, "Berhasil menghapus berita", 200);
    } catch (error) {
      next(error);
    }
  }
}