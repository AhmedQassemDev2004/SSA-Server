export interface User {
    id: number;
    email: string;
    name: string;
    phone: string;
    createdAt: Date;
    role: string;
    password?: string;
}

export interface TokenPayload {
    id: number;
    iat?: number;
    exp?: number;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}
