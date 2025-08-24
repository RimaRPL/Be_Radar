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
        pdfUrl: files.pdfUrl.map(file => file.path),  // ← array PDF
        region: req.body.region || "TULUNGAGUNG",
        publishedAt: req.body.publishedAt
          ? new Date(req.body.publishedAt)
          : new Date(),
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
    const id = req.params.id;
    const request: UpdateNewsRequest = { id, ...req.body };

    const oldNews = await NewsService.getNewsById({ id });

    // update cover
    if ((req.files as any)?.image && oldNews?.image) {
      const oldImagePath = path.resolve("public", oldNews.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      request.image = `news/${(req.files as any).image[0].filename}`;
    }

    // gabungkan pdf baru ke array lama
    if ((req.files as any)?.pdfUrl) {
      const newPdfs = (req.files as any).pdfUrl.map((f: any) => `news/${f.filename}`);
      request.pdfUrl = [...(oldNews?.pdfUrl || []), ...newPdfs];
    }

    // hapus PDF tertentu
    if (req.body.removePdf) {
      const toRemove = JSON.parse(req.body.removePdf);
      request.pdfUrl = (oldNews?.pdfUrl || []).filter(pdf => !toRemove.includes(path.basename(pdf)));

      // hapus file fisik
      toRemove.forEach((fileName: string) => {
        const fullPath = path.resolve("public/news", fileName);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    const response = await NewsService.updateNews(request);
    Wrapper.success(res, true, response, "Berhasil memperbarui berita", 200);

  } catch (error) {
    // rollback file baru jika gagal
    if ((req.files as any)?.image) {
      const newImagePath = path.resolve("public/news", (req.files as any).image[0].filename);
      if (fs.existsSync(newImagePath)) fs.unlinkSync(newImagePath);
    }
    if ((req.files as any)?.pdfUrl) {
      (req.files as any).pdfUrl.forEach((f: any) => {
        const newPdfPath = path.resolve("public/news", f.filename);
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