import { Request } from 'express';

export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string;
}

export interface JwtPayload {
    sub: number;
}

export interface RequestWithUser extends Request {
    user: Omit<User, 'password'>;
} 