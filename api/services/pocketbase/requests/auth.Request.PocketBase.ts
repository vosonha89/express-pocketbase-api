export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    email: string;
    refreshToken: string;
}

export interface LoginAdminRequest extends LoginRequest {
}

export interface LoginClientRequest extends LoginRequest {
}