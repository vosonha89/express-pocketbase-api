import { container, injectable } from 'tsyringe';
import { LoginInfo as AdminLoginInfo, LoginResponse as AdminLoginResponse } from '../../controllers/admin/auth/auth.Response';
import { LoginRequest as AdminLoginRequest, RefreshTokenRequest as AdminRefreshTokenRequest } from '../../controllers/admin/auth/auth.Request';
import { TokenService } from './token.Service';
import { UserAdminInfo, UserInfo } from '../../common/types/authType';
import { AppEnvironment } from '../../common/constants/environment';
import { StatusCode } from 'typescript-express-basic';
import { GenericService } from '../../common/abstractions/generic.Business';
import { LoginInfo as ClientLoginInfo, LoginResponse as ClientLoginResponse } from '../../controllers/client/auth/auth.Response';
import {
    LoginRequest as ClientLoginRequest,
    RefreshTokenRequest as ClientRefreshTokenRequest,
    LoginSocialRequest as ClientLoginSocialRequest,
    LoginWithOAuthRequest as ClientLoginWithOAuthRequest
} from '../../controllers/client/auth/auth.Request';
import { AuthPocketBaseService } from '../pocketbase/auth.PocketBase.Service';
import { LoggingService } from '../logic/logging.Service';
import { ErrorResponse, InternalServerError, NotFound, Unauthorized } from '../../common/responses/errorResponse';

@injectable()
export class AuthService extends GenericService {
    protected serviceName = 'AuthService';
    protected clientSuccessUrl = '/api/client/auth/loginSocialSuccess';
    public logger = container.resolve(LoggingService);
    public readonly authPocketBaseService = container.resolve(AuthPocketBaseService);
    public readonly tokenService = container.resolve(TokenService);

    /**
     * Login admin
     * @param request 
     * @returns 
     */
    public async loginAdmin(request: AdminLoginRequest): Promise<AdminLoginResponse | ErrorResponse> {
        const me = this;
        try {
            const response = new AdminLoginResponse();
            const authPBResponse = await me.authPocketBaseService.loginAdminWithPassword({
                email: request.username,
                password: request.password
            });
            const userProfile = new UserAdminInfo();
            userProfile.map(authPBResponse.record);
            userProfile.extToken = authPBResponse.token;
            const expiresIn = parseInt(AppEnvironment.TOKENEXP.toString());
            const loginInfo = {} as AdminLoginInfo;
            loginInfo.accessToken = me.tokenService.createToken(userProfile, expiresIn);
            delete userProfile.extToken;
            loginInfo.profile = userProfile;
            loginInfo.expireTime = expiresIn;
            loginInfo.refreshToken = authPBResponse.token;
            response.successful = true;
            response.status = StatusCode.Ok;
            response.data = loginInfo;
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'loginAdmin');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Login client
     * @param request 
     * @returns 
     */
    public async loginClient(request: ClientLoginRequest): Promise<ClientLoginResponse | ErrorResponse> {
        const me = this;
        try {
            const response = new ClientLoginResponse();
            const authPBResponse = await me.authPocketBaseService.loginClientWithPassword({
                email: request.username,
                password: request.password
            });
            const userProfile = new UserInfo();
            userProfile.map(authPBResponse.record);
            userProfile.extToken = authPBResponse.token;
            const expiresIn = parseInt(AppEnvironment.TOKENEXP.toString());
            const loginInfo = {} as ClientLoginInfo;
            loginInfo.accessToken = me.tokenService.createToken(userProfile, expiresIn);
            delete userProfile.extToken;
            loginInfo.profile = userProfile;
            loginInfo.expireTime = expiresIn;
            loginInfo.refreshToken = authPBResponse.token;
            response.successful = true;
            response.status = StatusCode.Ok;
            response.data = loginInfo;
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'loginClient');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Refresh token admin
     * @param request 
     * @returns 
     */
    public async refreshTokenAdmin(request: AdminRefreshTokenRequest): Promise<AdminLoginResponse | ErrorResponse> {
        const me = this;
        try {
            const response = new AdminLoginResponse();
            const authPBResponse = await me.authPocketBaseService.refreshAdminToken({
                email: request.username,
                refreshToken: request.refreshToken
            });
            if (authPBResponse.record.email != request.username) {
                return Unauthorized;
            }
            const userProfile = new UserAdminInfo();
            userProfile.map(authPBResponse.record);
            userProfile.extToken = authPBResponse.token;
            const expiresIn = parseInt(AppEnvironment.TOKENEXP.toString());
            const loginInfo = {} as AdminLoginInfo;
            loginInfo.accessToken = me.tokenService.createToken(userProfile, expiresIn);
            delete userProfile.extToken;
            loginInfo.profile = userProfile;
            loginInfo.expireTime = expiresIn;
            loginInfo.refreshToken = authPBResponse.token;
            response.successful = true;
            response.status = StatusCode.Ok;
            response.data = loginInfo;
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'refreshTokenAdmin');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Refresh token client
     * @param request 
     * @returns 
     */
    public async refreshTokenClient(request: ClientRefreshTokenRequest): Promise<ClientLoginResponse | ErrorResponse> {
        const me = this;
        try {
            const response = new ClientLoginResponse();
            const authPBResponse = await me.authPocketBaseService.refreshClientToken({
                email: request.username,
                refreshToken: request.refreshToken
            });
            if (authPBResponse.record.email != request.username) {
                return Unauthorized;
            }
            const userProfile = new UserInfo();
            userProfile.map(authPBResponse.record);
            userProfile.extToken = authPBResponse.token;
            const expiresIn = parseInt(AppEnvironment.TOKENEXP.toString());
            const loginInfo = {} as ClientLoginInfo;
            loginInfo.accessToken = me.tokenService.createToken(userProfile, expiresIn);
            delete userProfile.extToken;
            loginInfo.profile = userProfile;
            loginInfo.expireTime = expiresIn;
            loginInfo.refreshToken = authPBResponse.token;
            response.successful = true;
            response.status = StatusCode.Ok;
            response.data = loginInfo;
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'refreshTokenClient');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Client login social
     * @param request 
     * @returns 
     */
    public async loginClientSocial(request: ClientLoginSocialRequest): Promise<string | ErrorResponse> {
        const me = this;
        try {
            const authPBResponse = await me.authPocketBaseService.loginClientSocial(request.provider);
            if (!authPBResponse) {
                return NotFound;
            }
            const authInfo = authPBResponse;
            const urlObj = new URL(authInfo.authURL);
            // const state = urlObj.searchParams.get('state');
            urlObj.searchParams.set('state', request.provider + '-' + authInfo.codeVerifier + '-' + encodeURI(request.redirectUrl));
            const redirectUrl = AppEnvironment.API_HOSTNAME + me.clientSuccessUrl;
            const url = urlObj.toString() + encodeURI(redirectUrl);
            return url;
        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'loginClient');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Client login social result
     * @param request 
     * @returns 
     */
    public async loginClientSocialWithCode(request: ClientLoginWithOAuthRequest): Promise<ClientLoginResponse | ErrorResponse> {
        const me = this;
        try {
            const redirectUrl = AppEnvironment.API_HOSTNAME + me.clientSuccessUrl;
            const response = new ClientLoginResponse();
            const authPBResponse = await me.authPocketBaseService.loginClientWithOAuth2Code(
                request.provider,
                request.code,
                request.codeVerifier,
                redirectUrl
            );
            const userProfile = new UserInfo();
            userProfile.map(authPBResponse.record);
            userProfile.extToken = authPBResponse.token;
            const expiresIn = parseInt(AppEnvironment.TOKENEXP.toString());
            const loginInfo = {} as ClientLoginInfo;
            loginInfo.accessToken = me.tokenService.createToken(userProfile, expiresIn);
            delete userProfile.extToken;
            loginInfo.profile = userProfile;
            loginInfo.expireTime = expiresIn;
            loginInfo.refreshToken = authPBResponse.token;
            response.successful = true;
            response.status = StatusCode.Ok;
            response.data = loginInfo;
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'loginClient');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }
}