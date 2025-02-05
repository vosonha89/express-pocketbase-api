import { RouteControllerType } from '../../common/types/routeType';

export const AdminRouteName = 'api/admin';

/**
 * Admin route object
 */
export class AdminRouteObject {
    public readonly GenericController = {
        controllerPath: AdminRouteName + '/generic',
        actionPaths: {
            search: '/search',
            getById: '/getById',
            create: '/create',
            update: '/update',
            delete: '/delete'
        }
    } as RouteControllerType;
    public readonly AuthController = {
        controllerPath: AdminRouteName + '/auth',
        actionPaths: {
            login: '/login',
            refreshToken: '/refreshToken'
        }
    } as RouteControllerType;
}

export const AdminRoutes = new AdminRouteObject();