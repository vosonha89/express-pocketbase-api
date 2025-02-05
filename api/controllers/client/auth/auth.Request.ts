import { Request } from 'express';
import { BaseRequest } from '../../../common/requests/baseRequest';
import { GlobalError } from '../../../errors/globalError';
import { BadRequest } from '../../../common/responses/errorResponse';
import { ClientError } from '../../../common/types/errorType';

/**
 * LoginRequest type
 * @typedef {object} LoginRequest
 * @property {string} username - 
 * @property {string} password - 
 */
export class LoginRequest extends BaseRequest {
    public username!: string;
    public password!: string;

    public mapRequest(req: Request): void {
        const me = this;
        if (req.body.username) {
            me.username = req.body.username;
        }
        if (req.body.password) {
            me.password = req.body.password;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.username) {
            const error = GlobalError.RequiredError('Username');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.password) {
            const error = GlobalError.RequiredError('Password');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

export class RefreshTokenRequest extends BaseRequest {
    public username!: string;
    public refreshToken!: string;

    public mapRequest(req: Request): void {
        const me = this;
        if (req.body.username) {
            me.username = req.body.username;
        }
        if (req.body.refreshToken) {
            me.refreshToken = req.body.refreshToken;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.username) {
            const error = GlobalError.RequiredError('Username');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.refreshToken) {
            const error = GlobalError.RequiredError('RefreshToken');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

export class LoginSocialRequest extends BaseRequest {
    public provider!: string;
    public redirectUrl!: string;

    public mapRequest(req: Request): void {
        const me = this;
        if (req.query.provider) {
            me.provider = req.query.provider as string;
        }
        if (req.query.redirectUrl) {
            me.redirectUrl = req.query.redirectUrl as string;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.provider) {
            const error = GlobalError.RequiredError('Provider');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.redirectUrl) {
            const error = GlobalError.RequiredError('RedirectUrl');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

export class LoginWithOAuthRequest extends BaseRequest {
    public provider!: string;
    public code!: string;
    public codeVerifier!: string;

    public mapRequest(req: Request): void {
        const me = this;
        if (req.query.provider) {
            me.provider = req.query.provider as string;
        }
        if (req.query.code) {
            me.code = req.query.code  as string;
        }
        if (req.query.codeVerifier) {
            me.codeVerifier = req.query.codeVerifier  as string;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.provider) {
            const error = GlobalError.RequiredError('Provider');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.code) {
            const error = GlobalError.RequiredError('Code');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.codeVerifier) {
            const error = GlobalError.RequiredError('CodeVerifier');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}