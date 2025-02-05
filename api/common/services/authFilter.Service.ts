import { Request, Response } from 'express';
import { container, Lifecycle, scoped } from 'tsyringe';
import { TokenService } from '../../services/business/token.Service';
import { Unauthorized } from '../responses/errorResponse';
import { AnyType, StatusCode } from 'typescript-express-basic';
import { UserAdminInfo, UserInfo } from '../types/authType';
import { LoggingAdminService } from '../../services/logic/loggingAdmin.Service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AdminRoutes } from '../../controllers/admin/routes';
import { ClientRoutes } from '../../controllers/client/routes';

/**
 * Auth filter service
 */
@scoped(Lifecycle.ContainerScoped)
export class AuthFilterService {
    public readonly exceptionUrl = [
        ClientRoutes.AuthController.controllerPath + ClientRoutes.AuthController.actionPaths['login'],
        ClientRoutes.AuthController.controllerPath + ClientRoutes.AuthController.actionPaths['loginsocial'],
        ClientRoutes.AuthController.controllerPath + ClientRoutes.AuthController.actionPaths['loginsocialsuccess'],
        ClientRoutes.AuthController.controllerPath + ClientRoutes.AuthController.actionPaths['refreshtoken'],
        AdminRoutes.AuthController.controllerPath + AdminRoutes.AuthController.actionPaths['login'],
        AdminRoutes.AuthController.controllerPath + AdminRoutes.AuthController.actionPaths['refreshToken'],
    ];
    protected loggerAdmin = container.resolve(LoggingAdminService);
    protected loggerClient = container.resolve(LoggingAdminService);
    protected tokenService = container.resolve(TokenService);
    public token = '';

    /**
     * Get authentication token
     * @param request 
     * @returns 
     */
    public getToken(request: Request): string {
        if (request.headers.authorization && request.headers.authorization.split(" ")[0] === "Bearer") {
            return request.headers.authorization.split(" ")[1];
        }
        return '';
    }

    /**
     * Check valid user
     * @param token 
     * @returns 
     */
    public authenticated(token: string): boolean {
        const me = this;
        const payload = me.tokenService.verifyToken(token);
        if (!payload) {
            return false;
        }
        else {
            const pbPayload = jwt.decode(payload.extToken) as JwtPayload;
            if (!pbPayload || !pbPayload.exp) {
                return false;
            }
            else {
                const expiresIn = new Date(pbPayload.exp * 1000);
                if (expiresIn < new Date()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check authentication
     * @param request 
     * @param response 
     * @param next 
     */
    public checkAuthentication(request: Request, response: Response, next: AnyType): void {
        const me = this;
        try {
            // exception for authentication
            if (me.exceptionUrl.includes(request.path?.toLowerCase())) {
                next();
            }
            // logic for authentication
            else {
                me.token = '';
                const token = this.getToken(request);
                if (token) {
                    const authenticated = me.authenticated(token);
                    if (authenticated) {
                        me.token = token;
                        next();
                    }
                    else {
                        response.status(StatusCode.Ok).json(Unauthorized);
                    }
                }
                else {
                    response.status(StatusCode.Ok).json(Unauthorized);
                }
            }
        } catch (ex) {
            if (request.url.includes('/api/client')) {
                me.loggerClient.logError(ex, request.headers.authorization as string, 'checkAuthentication');
            }
            else if (request.url.includes('/api/admin')) {
                me.loggerAdmin.logError(ex, request.headers.authorization as string, 'checkAuthentication');
            }
            response.status(StatusCode.Ok).json(Unauthorized);
        }
    }

    /**
     * Get current user
     * @returns 
     */
    public getCurrentUser(isAdmin = false): UserInfo | UserAdminInfo | undefined {
        const me = this;
        const payload = me.tokenService.verifyToken(me.token);
        if (!payload) {
            return undefined;
        }
        if (isAdmin) {
            return payload as UserAdminInfo;
        }
        else {
            return payload as UserInfo;
        }
    }
}