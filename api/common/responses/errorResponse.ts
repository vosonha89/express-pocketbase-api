import { StatusCode } from 'typescript-express-basic';
import { BaseResponseData } from './baseResponse';
import { ClientError } from '../types/errorType';
import { GlobalError } from '../../errors/globalError';

export class ErrorResponse extends BaseResponseData<object> {
    constructor(status: number, msg?: string, exception?: ClientError) {
        super();
        this.data = undefined;
        this.status = status;
        this.successful = false;
        if (msg) {
            this.msg = msg;
        }
        if (exception) {
            this.exception = exception;
        }
    }
}

export const NotFound = new ErrorResponse(StatusCode.NotFound,
    'The requested resource could not be found.',
    {
        errorCode: GlobalError.NotFoundError.code.toString(),
        errorMessage: GlobalError.NotFoundError.msg
    } as ClientError
);
export const Unauthorized = new ErrorResponse(StatusCode.Unauthorized,
    'The user does not have the necessary credentials.',
    {
        errorCode: GlobalError.UnauthorizedError.code.toString(),
        errorMessage: GlobalError.UnauthorizedError.msg
    } as ClientError
);
export const Forbidden = new ErrorResponse(StatusCode.Forbidden,
    'The user might not have the necessary permissions for a resource.',
    {
        errorCode: GlobalError.ForbiddenError.code.toString(),
        errorMessage: GlobalError.ForbiddenError.msg
    } as ClientError
);
export const BadRequest = (exception?: ClientError) => {
    return new ErrorResponse(StatusCode.BadRequest,
        'The server cannot or will not process the request due to an apparent client error',
        exception);
};
export const InternalServerError = (exception?: ClientError) => {
    return new ErrorResponse(StatusCode.InternalServerError,
        'An unexpected condition was encountered and no more specific message is suitable',
        exception);
};