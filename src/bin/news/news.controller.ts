import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { CreateNewsRequest, getNews, UpdateNewsRequest } from "./news.model";
import { NewsService } from "./news.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { removeFileIfExists } from "../../helper/delete.file.helper";
import { request } from "http";
import path from "path";
import fs from "fs";

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
        // pdfUrl: files.pdfUrl[0].path, // ini buat yang satu
        pdfUrl: files.pdfUrl.map(file => file.path), // ini buat yang lebih dari satu
        region: req.body.region || "TULUNGAGUNG",
        // publishedAt: new Date(),
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
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
      const id = req.params.id; // ambil id dari URL
      const request: UpdateNewsRequest = {
        id,
        ...req.body,
      };

      const oldNews = await NewsService.getNewsById({ id });

      // Hapus file gambar lama jika ada
      if ((req.files as any)?.image && oldNews?.image) {
        const oldImagePath = path.resolve("public", oldNews.image); // lebih aman
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        request.image = `news/${(req.files as any).image[0].filename}`;
      }

      // Hapus file PDF lama jika ada
      if ((req.files as any)?.pdfUrl && Array.isArray(oldNews?.pdfUrl) && oldNews.pdfUrl.length > 0) {
        oldNews.pdfUrl.forEach((pdfPath: string) => {
          const fullPdfPath = path.resolve("public", pdfPath);
          if (fs.existsSync(fullPdfPath)) {
            fs.unlinkSync(fullPdfPath);
          }
        });

        request.pdfUrl = (req.files as any).pdfUrl.map((f: any) => `news/${f.filename}`);
      }

      const response = await NewsService.updateNews(request);
      Wrapper.success(res, true, response, "Berhasil memperbarui berita", 200)
    } catch (error) {
      // Hapus file baru jika terjadi error saat upload
      if ((req.files as any)?.image) {
        const newImagePath = path.resolve("public", "news", (req.files as any).image[0].filename);
        if (fs.existsSync(newImagePath)) fs.unlinkSync(newImagePath);
      }
      if ((req.files as any)?.pdfUrl) {
        (req.files as any).pdfUrl.forEach((f: any) => {
          const newPdfPath = path.resolve("public", "news", f.filename);
          if (fs.existsSync(newPdfPath)) fs.unlinkSync(newPdfPath);
        });
      }
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