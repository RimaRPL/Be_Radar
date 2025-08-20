import { Role } from '@prisma/client'
import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { Jwt } from '../helper/jwt.helper'
import { uploadNews } from '../helper/UploadNews.helper'
import { NewsController } from '../bin/news/news.controller'

export const privateApi = express.Router()

/** Role */
const roles = {
    ADMIN: Role.ADMIN,
    USER : Role.USER
}

//create news
privateApi.post(
  `${globalEnv.PREFIX}/news/create`,
  Jwt.jwtValidator,
  Jwt.allowedRole(roles.ADMIN),
  uploadNews.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfUrl', maxCount: 10 }
  ]),
  NewsController.createNews
)

//update news
privateApi.post(
  `${globalEnv.PREFIX}/news/update`,
  Jwt.jwtValidator,
  Jwt.allowedRole(roles.ADMIN),
  uploadNews.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfUrl', maxCount: 10 }
  ]),
  NewsController.updateNews
)

//delete news
privateApi.delete(
  `${globalEnv.PREFIX}/news/delete/:id`,
  Jwt.jwtValidator,
  Jwt.allowedRole(roles.ADMIN),
  NewsController.deleteNews
)
