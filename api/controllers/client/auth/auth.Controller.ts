import { Request, Response } from 'express';
import { ApiController, ApiMethod, ApiRoute, StatusCode } from 'typescript-express-basic';
import { container } from 'tsyringe';
import { AuthService } from '../../../services/business/auth.Service';
import { LoginRequest, LoginSocialRequest, LoginWithOAuthRequest, RefreshTokenRequest } from '../auth/auth.Request';
import { ClientRoutes } from '../routes';
import { LoggingClientService } from '../../../services/logic/loggingClient.Service';
import { AppError } from '../../../common/types/errorType';
import { ErrorResponse } from '../../../common/responses/errorResponse';
import { LoginResponse } from './auth.Response';

export class AuthController extends ApiController {
    public controllerName = ClientRoutes.AuthController.controllerPath;
    protected logger = container.resolve(LoggingClientService);
    protected authService = container.resolve(AuthService);

    @ApiRoute({
        method: ApiMethod.GET,
        path: ClientRoutes.AuthController.actionPaths['loginSocial']
    })
    public async loginSocial(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = new LoginSocialRequest();
            request.mapRequest(req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.authService.loginClientSocial(request);
            if (typeof response == 'string') {
                res.redirect(response);
            }
            else {
                throw new AppError(response);
            }
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.AuthController.actionPaths['loginSocial']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.GET,
        path: ClientRoutes.AuthController.actionPaths['loginSocialSuccess']
    })
    public async loginSocialSuccess(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const state = req.query.state as string;
            const provider = state.split('-')[0];
            const codeVerifier = state.split('-')[1];
            const redirectUrl = state.split('-')[2];
            req.query.provider = provider;
            req.query.codeVerifier = codeVerifier;
            req.query.redirectUrl = '';
            const request = new LoginWithOAuthRequest();
            request.mapRequest(req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.authService.loginClientSocialWithCode(request);
            if (response.successful) {
                const url = redirectUrl + '?accessCode=' + (response as LoginResponse).data?.refreshToken;
                res.redirect(url);
            }
            else {
                throw new AppError(response);
            }
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.AuthController.actionPaths['login']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.POST,
        path: ClientRoutes.AuthController.actionPaths['login']
    })
    public async login(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const loginRequest = {} as LoginRequest;
            loginRequest.username = req.body.username as string;
            loginRequest.password = req.body.password as string;
            const response = await me.authService.loginClient(loginRequest);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.AuthController.actionPaths['login']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.POST,
        path: ClientRoutes.AuthController.actionPaths['refreshToken']
    })
    public async refreshToken(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const clientRequest = {} as RefreshTokenRequest;
            clientRequest.username = req.body.username as string;
            clientRequest.refreshToken = req.body.refreshToken as string;
            const response = await me.authService.refreshTokenClient(clientRequest);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.AuthController.actionPaths['refreshToken']);
            res.json((ex as AppError).exception);
        }
    }
}