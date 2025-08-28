import multer from 'multer'
import path from 'path'

const sanitizeFilename = (name: string) => {
  return name
    .replace(/\s+/g, '_')               // ganti spasi dengan _
    .replace(/[^a-zA-Z0-9_\-\.]/g, '')  // hapus karakter aneh
}

const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/news'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    const uniqueName = `${Date.now()}-${sanitizeFilename(base)}${ext}`
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