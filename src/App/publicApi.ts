import express from 'express'
import { globalEnv } from '../utils/globalEnv.utils'
import { UserController } from '../bin/user/user.controller'
import { Jwt } from '../helper/jwt.helper'
import {uploadUser} from '../helper/UploadUser.helper'

export const publicApi = express.Router()

/** Register */
publicApi.post(`${globalEnv.PREFIX}/register`, uploadUser.array('image', 1) ,UserController.Register)

/** Login */
publicApi.post(`${globalEnv.PREFIX}/login`, UserController.Login)

/** Api For User */

publicApi.put(`${globalEnv.PREFIX}/updateUser`, uploadUser.array('image', 1),Jwt.jwtValidator, UserController.UpdateUser)
publicApi.get(`${globalEnv.PREFIX}/profile`,Jwt.jwtValidator, UserController.GetProfile)
publicApi.delete(`${globalEnv.PREFIX}/deleteUser/:id`,Jwt.jwtValidator, UserController.DeleteUser)
publicApi.post(`${globalEnv.PREFIX}/logout`, UserController.Logout);

/** Api For Request Otp */
publicApi.post(`${globalEnv.PREFIX}/otp`, UserController.RequestOtp)
publicApi.post(`${globalEnv.PREFIX}/otp/confirm`, UserController.ConfirmOtp)
