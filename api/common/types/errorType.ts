import { ErrorResponse } from '../responses/errorResponse';
/**
 * Normal error message
 */
export interface ErrorMessage {
    code: number;
    msg: string;
}

/**
 * Error definition for client side
 */
export interface ClientError {
    errorCode: string;
    errorMessage: string;
}

/**
 * Error
 */
export class AppError extends Error {
    public exception: ErrorResponse;

    /**
     *
     */
    constructor(exception: ErrorResponse, message?: string) {
        super(message);
        this.exception = exception;
    }
}