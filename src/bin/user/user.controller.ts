import { NextFunction, Response } from "express";
import { CustomRequest, ErrorHandler } from "../../config/custom.config";
import { confirmOtp, Login, register, requestOtp, updateUser } from "./user.model";
import { UserService } from "./user.service";
import { Wrapper } from "../../utils/wrapper.utils";
import { removeFileIfExists } from "../../helper/delete.file.helper";

export class UserController {
    static async Register(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: register = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
            const response = await UserService.Register(request)
            Wrapper.success(res, true, response, 'Succes Register', 200)
        } catch (error) {
            next(error)
        }
    }

    static async Login(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: Login = req.body as Login

            const response = await UserService.Login(request)
            Wrapper.success(res, true, response, 'Succes Login', 200)
        } catch (error) {
            next(error)
        }
    }

    static async UpdateUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: updateUser = req.body as updateUser

            // pakai array() jadi req.files (bentuk array)
            const files = req.files as Express.Multer.File[];

            if (files && files.length > 0) {
                request.image = files[0].filename; // mengambil nama file pertama
            }

            const response = await UserService.updateUser(request)
            Wrapper.success(res, true, response, 'Succes Updated', 200)
        } catch (error) {
            next(error)
        }
    }

    static async GetProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await UserService.getProfile(req.user!.id)
            Wrapper.success(res, true, response, 'Succes Get User Profile', 200)
        } catch (error) {
            next(error)

        }
    }

    static async DeleteUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request = req.params.id

            const response = await UserService.DeleteUser(request)
            Wrapper.success(res, true, response, 'Success Delete User', 200)
        } catch (error) {
            next(error)
        }
    }

    static async Logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Contoh jika pakai token dalam Authorization header
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new ErrorHandler(401, "Tidak ada token yang dikirim");
            }

            // Jika ingin blacklist token (opsional), bisa disimpan di database atau Redis
            // await prisma.tokenBlacklist.create({ data: { token } });

            Wrapper.success(res, true, null, "Logout berhasil", 200);
        } catch (error) {
            next(error);
        }
    }

    static async RequestOtp(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: requestOtp = req.body as requestOtp

            const response = await UserService.requestOtp(request)
            Wrapper.success(res, true, response, 'Success send otp', 200)
        } catch (error) {
            next(error)
        }
    }

    static async ConfirmOtp(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: confirmOtp = req.body as confirmOtp

            const response = await UserService.confirmOtp(request)
            Wrapper.success(res, true, response, 'Success confirm otp', 200)
        } catch (error) {
            next(error)
        }
    }

}