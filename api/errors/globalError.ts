import { StatusCode } from 'typescript-express-basic';
import { ErrorMessage } from '../common/types/errorType';

/**
 * Global error
 */
export class GlobalError {
    public static readonly InternalServerError = {
        code: StatusCode.InternalServerError,
        msg: 'InternalServerError'
    } as ErrorMessage;
    public static readonly BadRequestError = {
        code: StatusCode.BadRequest,
        msg: 'BadRequestError'
    } as ErrorMessage;
    public static readonly UnauthorizedError = {
        code: StatusCode.Unauthorized,
        msg: 'UnauthorizedError'
    } as ErrorMessage;
    public static readonly ForbiddenError = {
        code: StatusCode.Forbidden,
        msg: 'ForbiddenError'
    } as ErrorMessage;
    public static readonly NotFoundError = {
        code: StatusCode.NotFound,
        msg: 'NotFoundError'
    } as ErrorMessage;
    public static readonly RequiredError = (fieldName: string) => {
        return {
            code: StatusCode.BadRequest * 10 + 1,
            msg: fieldName.trim() + ' is required.'
        } as ErrorMessage;
    }
    public static readonly TypeError = (fieldName: string, fieldType: string) => {
        return {
            code: StatusCode.BadRequest * 10 + 2,
            msg: fieldName.trim() + ' is not valid ' + fieldType + ' type.'
        } as ErrorMessage;
    }
}
