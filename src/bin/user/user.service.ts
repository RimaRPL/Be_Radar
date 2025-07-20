import { ErrorHandler } from "../../config/custom.config";
import loggerConfig from "../../config/logger.config";
import prisma from "../../config/prisma.config";
import { Validator } from "../../utils/validator.utils";
import { confirmOtp, Login, register, requestOtp, toUserResponse, updateUser } from "./user.model";
import bcrypt from "bcrypt";
import { Crypto } from "../../helper/crypto.helper";
import { userSchema } from "./user.schema";
import { Jwt } from "../../helper/jwt.helper";
import jwt from "jsonwebtoken";
import { CreateSecureOtp } from "../../utils/createOtp";
import { Nodemailer } from "../../helper/nodemailer/nodemailer.helper";
import { globalEnv } from "../../utils/globalEnv.utils";
import { removeFileIfExists } from "../../helper/delete.file.helper";

export class UserService {
    static async Register(req: register) {
        const ctx = 'Register'
        const scp = 'User'

        const userRequest = Validator.Validate(userSchema.registerUser, req)

        const isuserExist = await prisma.user.count({
            where: {
                OR: [{ email: userRequest.email }, { username: userRequest.username }],
            },
        });

        if (isuserExist !== 0) {
            loggerConfig.error(ctx, "User already regist", scp);
            throw new ErrorHandler(409, "Akun sudah terdaftar");
        }

        const hashedPassword = await bcrypt.hash(userRequest.password, 10);

        const user = await prisma.user.create({
            data: {
                username: userRequest.username,
                email: userRequest.email,
                password: hashedPassword,
                image: userRequest.image,
            },
        });

        loggerConfig.info(ctx, `User created successfully`, scp);

        return {
            user: {
                id: Crypto.encode(user.id),
                username: user.username,
                email: user.email,
                image: user.image,
            }
        }
    };

    static async Login(req: Login) {
        const ctx = 'Login';
        const scp = 'user'

        const userRequest = Validator.Validate(userSchema.login, req);

        const isUserExist = await prisma.user.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { username: userRequest.username },
                            { email: userRequest.email },
                            { password: userRequest.password },
                        ],
                    },
                    {
                        OR: [
                            { onDelete: false },
                        ]
                    }
                ],
            },
        });

        if (!isUserExist) {
            loggerConfig.error(ctx, "User not found", scp);
            throw new ErrorHandler(400, "Akun belum terdaftar");
        }

        const isPasswordMatch = await bcrypt.compare(
            userRequest.password,
            isUserExist.password
        );

        if (!isPasswordMatch) {
            loggerConfig.error(ctx, "Invalid password", scp);
            throw new ErrorHandler(400, "Password anda salah");
        }

        const token = Jwt.createJwt({
            id: Crypto.encode(isUserExist.id),
            role: isUserExist.role,
            email: isUserExist.email,
            username: isUserExist.username
        });

        return {
            token,
            role: isUserExist.role,
        }
    }

    static async updateUser(req: updateUser) {
        const ctx = "Update User";
        const scp = "User";

        const userRequest = Validator.Validate(userSchema.updateUser, req);

        const existing = await prisma.user.findFirst({
            where: {
                id: userRequest.id,
            },
        });

        if (!existing) {
            loggerConfig.error(ctx, "User Not Found", scp);
            throw new ErrorHandler(404, "User Tidak Ditemukan");
        }

        const updateData = {
            email: userRequest.email ?? existing.email,
            username: userRequest.username ?? existing.username,
            password: userRequest.password ?? existing.password,
            image: userRequest.image ?? existing.image,
        };

        const updated = await prisma.user.update({
            where: { id: req.id },
            data: updateData,
        });

        if (existing.image) {
            removeFileIfExists(existing.image);
        }
        return {};
    }

    static async getProfile(req: string) {
        const ctx = 'Get Profile'
        const scp = 'User'

        const userRequest = Validator.Validate(userSchema.Get_User_Profile, { id: req })

        const isUserExist = await prisma.user.findFirst({
            where: {
                id: userRequest.id
            }
        })

        if (!isUserExist) {
            loggerConfig.error(ctx, 'User not found', scp)
            throw new ErrorHandler(404, 'User tidak ditemukan')
        }

        loggerConfig.info(ctx, 'Succes Get Profile', scp)

        return toUserResponse(isUserExist)
    }

    static async DeleteUser(req: string) {
        const ctx = "Delete User";
        const scp = "User";

        const userRequest = Validator.Validate(userSchema.Get_User_Profile, {
            id: req,
        });

        const isUserExist = await prisma.user.findUnique({
            where: {
                id: userRequest.id,
            },
        });

        if (!isUserExist) {
            loggerConfig.error(ctx, "User Not Found", scp);
            throw new ErrorHandler(404, "User Tidak Ditemukan");
        }

        await prisma.log.deleteMany({
            where: { userId: userRequest.id },
        });

        await prisma.user.delete({
            where: {
                id: userRequest.id,
            },
        });

        if(isUserExist.image) {
            removeFileIfExists(isUserExist.image);
        }

        loggerConfig.info(ctx, "Succes Delete User", scp);

        return {};
    }

    static async requestOtp(req: requestOtp) {
        const ctx = "Request Otp";
        const scp = "User";

        const userRequest = Validator.Validate(userSchema.Request_Otp, req);

        const isUserExist = await prisma.user.findUnique({
            where: {
                email: userRequest.email,
                username: userRequest.username
            },
        });

        if (!isUserExist) {
            loggerConfig.error(ctx, "User Not Found", scp);
            throw new ErrorHandler(404, "User Tidak Ditemukan");
        }

        const otp = CreateSecureOtp();
        await prisma.otp.create({
            data: {
                email: userRequest.email,
                code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        await Nodemailer.sendUserForgotPassword(isUserExist.email, otp);

        return {};
    }

    /** Confirm OTP */
    static async confirmOtp(req: confirmOtp) {
        const ctx = "Confirm OTP";
        const scp = "User";

        const userRequest = Validator.Validate(userSchema.Confirm_Otp, req);

        const otpRecord = await prisma.otp.findFirst({
            where: {
                code: userRequest.otp,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!otpRecord) {
            loggerConfig.error(ctx, "Invalid pr Expired OTP", scp);
            throw new ErrorHandler(400, "OTP tidak valid");
        }

        await prisma.otp.delete({
            where: { id: otpRecord.id }
        });

        const token = jwt.sign(
            { email: otpRecord.email },
            globalEnv.JWT_SECRET!,
            { expiresIn: "1h" }
        )

        loggerConfig.info(ctx, "OTP verified, reset token generated", scp);
        return {
            message: 'OTP berhasil diverifikasi',
            token
        }
    }
}   