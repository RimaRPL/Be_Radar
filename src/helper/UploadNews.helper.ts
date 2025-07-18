import multer from 'multer'

const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/news'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

export const uploadNews = multer({ storage: newsStorage })
