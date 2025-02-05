import { RouteControllerType } from '../../common/types/routeType';

export const ClientRouteName = 'api/client';

/**
 * Client route object
 */
export class ClientRouteObject {
    public readonly GenericController = {
        controllerPath: ClientRouteName + '/generic',
        actionPaths: {
            search: '/search',
            getById: '/getById',
            create: '/create',
            update: '/update',
            delete: '/delete'
        }
    } as RouteControllerType;
    public readonly AuthController = {
        controllerPath: ClientRouteName + '/auth',
        actionPaths: {
            login: '/login',
            loginSocial: '/loginSocial',
            loginSocialSuccess: '/loginSocialSuccess',
            refreshToken: '/refreshToken'
        }
    } as RouteControllerType;
}

export const ClientRoutes = new ClientRouteObject();