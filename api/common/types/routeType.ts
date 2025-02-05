/**
 * For action path
 */
export interface RouteActionType {
    [key: string]: string;
}

/**
 * For controller path
 */
export interface RouteControllerType {
    controllerPath: string;
    actionPaths: RouteActionType;
}