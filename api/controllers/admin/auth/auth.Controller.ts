import { Request, Response } from 'express';
import { ApiController, ApiMethod, ApiRoute, StatusCode } from 'typescript-express-basic';
import { container } from 'tsyringe';
import { AuthService } from '../../../services/business/auth.Service';
import { LoginRequest, RefreshTokenRequest } from '../auth/auth.Request';
import { AdminRoutes } from '../routes';
import { LoggingClientService } from '../../../services/logic/loggingClient.Service';
import { AppError } from '../../../common/types/errorType';

export class AuthController extends ApiController {
    public controllerName = AdminRoutes.AuthController.controllerPath;
    protected logger = container.resolve(LoggingClientService);
    protected authService = container.resolve(AuthService);

    @ApiRoute({
        method: ApiMethod.POST,
        path: AdminRoutes.AuthController.actionPaths['login']
    })
    public async login(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const clientRequest = {} as LoginRequest;
            clientRequest.username = req.body.username as string;
            clientRequest.password = req.body.password as string;
            const response = await me.authService.loginAdmin(clientRequest);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, AdminRoutes.AuthController.actionPaths['login']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.POST,
        path: AdminRoutes.AuthController.actionPaths['refreshToken']
    })
    public async refreshToken(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const clientRequest = {} as RefreshTokenRequest;
            clientRequest.username = req.body.username as string;
            clientRequest.refreshToken = req.body.refreshToken as string;
            const response = await me.authService.refreshTokenAdmin(clientRequest);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, AdminRoutes.AuthController.actionPaths['refreshToken']);
            res.json((ex as AppError).exception);
        }
    }
}