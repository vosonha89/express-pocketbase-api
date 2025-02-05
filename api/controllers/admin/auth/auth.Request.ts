/**
 * LoginRequest type
 * @typedef {object} LoginRequest
 * @property {string} username - 
 * @property {string} password - 
 */
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RefreshTokenRequest {
    username: string;
    refreshToken: string;
}