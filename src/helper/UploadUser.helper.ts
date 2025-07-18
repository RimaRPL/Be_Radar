import multer from 'multer'

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/user'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

export const uploadUser = multer({ storage: userStorage })
