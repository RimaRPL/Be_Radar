import { Role, User } from "@prisma/client";

export interface Login {
    username: string;
    email: string;
    password: string;
}

export interface register {
    username: string
    email: string
    password: string
    image: string
}

export interface userResponse {
    id: string,
    username: string,
    email: string,
    image: string
}

export interface updateUser {
    id: string
    username?: string
    email?: string
    password?: string
    image: string;
}  

export interface requestOtp {
    email: string
}

export interface confirmOtp {
    email: string
    otp: string
}



export function toUserResponse(user: User): userResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image ?? ''
    }
}