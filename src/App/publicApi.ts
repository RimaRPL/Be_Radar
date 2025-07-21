import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'
import { Jwt } from '../helper/jwt.helper'
import { uploadUser } from '../helper/UploadUser.helper'
import { NewsController } from '../bin/news/news.controller'
import { savedController } from '../bin/saved/saved.controller'
import { CommentController } from '../bin/comment/comment.controller'

export const publicApi = express.Router()

/** Register */
publicApi.post(`${globalEnv.PREFIX}/register`, uploadUser.array('image', 1), UserController.Register)

/** Login */
publicApi.post(`${globalEnv.PREFIX}/login`, UserController.Login)

/** Api For User */
publicApi.put(`${globalEnv.PREFIX}/updateUser`, uploadUser.array('image', 1), Jwt.jwtValidator, UserController.UpdateUser)
publicApi.get(`${globalEnv.PREFIX}/profile`, Jwt.jwtValidator, UserController.GetProfile)
publicApi.delete(`${globalEnv.PREFIX}/deleteUser/:id`, Jwt.jwtValidator, UserController.DeleteUser)
publicApi.post(`${globalEnv.PREFIX}/logout`, UserController.Logout);

/** Api For Request Otp */
publicApi.post(`${globalEnv.PREFIX}/otp`, UserController.RequestOtp)
publicApi.post(`${globalEnv.PREFIX}/otp/confirm`, UserController.ConfirmOtp)

/** Api for news */
publicApi.get(`${globalEnv.PREFIX}/news`, NewsController.getAllNews);
publicApi.get(`${globalEnv.PREFIX}/news/:id`, NewsController.getNewsById);

/** Api for saved */
publicApi.post(`${globalEnv.PREFIX}/saved/create`, Jwt.jwtValidator, savedController.createSaved);
publicApi.get(`${globalEnv.PREFIX}/get/saved`, Jwt.jwtValidator, savedController.getSaved);
publicApi.delete(`${globalEnv.PREFIX}/saved/delete/:id`, Jwt.jwtValidator, savedController.deleteSaved);

/** Api for comments */
publicApi.post(`${globalEnv.PREFIX}/comments/create`, Jwt.jwtValidator, CommentController.createComment);
publicApi.put(`${globalEnv.PREFIX}/comments/update`, Jwt.jwtValidator, CommentController.updateComment);    
publicApi.delete(`${globalEnv.PREFIX}/comments/delete/:id`, Jwt.jwtValidator, CommentController.deleteComent);
publicApi.get(`${globalEnv.PREFIX}/comments/all`, Jwt.jwtValidator, CommentController.getAllComments);
