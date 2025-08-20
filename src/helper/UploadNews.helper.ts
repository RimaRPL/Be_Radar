import multer from 'multer'
import path from 'path'

const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/news'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

export const uploadNews = multer({ storage: newsStorage })

// ✅ helper untuk normalisasi path jadi URL-friendly
export const normalizePath = (filePath: string | null | undefined): string | null => {
  if (!filePath) return null;

  return filePath
    .replace(/\\/g, "/")
    .replace(/^public\//, "")
    .replace(/^\/+/, "");
};