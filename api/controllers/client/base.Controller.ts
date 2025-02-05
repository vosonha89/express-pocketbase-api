import { Request, Response } from 'express';
import { ApiMethod, ApiRoute, StatusCode } from 'typescript-express-basic';
import { GenericClientApiController } from '../../common/abstractions/genericApi.Controller';
import { BaseCreateRequest, BaseDeleteRequest, BaseGetById, BaseSearchRequest, BaseUpdateRequest } from '../../common/requests/baseRequest';
import { AppError } from '../../common/types/errorType';
import { UserInfo } from '../../common/types/authType';
import { ErrorResponse } from '../../common/responses/errorResponse';
import { IGenericService } from '../../common/abstractions/generic.Business';
import { PocketBaseItem } from '../../services/pocketbase/responses/baseResponse.PocketBase';
import { GenericObject } from '../../common/abstractions/genericObject.type';
import { BaseResponseData, BaseSearchResponse } from '../../common/responses/baseResponse';
import { ClientRoutes } from './routes';

/**
 * Abstract client controller
 */
export abstract class BaseClientController<
    TSearchRequest extends BaseSearchRequest,
    TGetByIdRequestRequest extends BaseGetById,
    TCreateRequest extends BaseCreateRequest,
    TUpdateRequest extends BaseUpdateRequest,
    TDeletRequest extends BaseDeleteRequest,
    TSearchResponse extends BaseResponseData<BaseSearchResponse<TEntity>>,
    TGetByIdResponse extends BaseResponseData<TEntity>,
    TCreateResponse extends BaseResponseData<TEntity>,
    TUpdateResponse extends BaseResponseData<TEntity>,
    TDeleteResponse extends BaseResponseData<TEntity>,
    TEntity extends GenericObject<TPocketBaseEntityResponse>,
    TPocketBaseEntityResponse extends PocketBaseItem,
>
    extends GenericClientApiController {
    protected abstract businessService: IGenericService<
        TSearchRequest,
        TGetByIdRequestRequest,
        TCreateRequest,
        TUpdateRequest,
        TDeletRequest,
        TSearchResponse,
        TGetByIdResponse,
        TCreateResponse,
        TUpdateResponse,
        TDeleteResponse,
        TEntity,
        TPocketBaseEntityResponse>;
    protected abstract getSearchRequest(currentUser: UserInfo, req: Request): TSearchRequest;
    protected abstract getGetByIdRequestRequest(currentUser: UserInfo, req: Request): TGetByIdRequestRequest;
    protected abstract getCreateRequest(currentUser: UserInfo, req: Request): TCreateRequest;
    protected abstract getUpdateRequest(currentUser: UserInfo, req: Request): TUpdateRequest;
    protected abstract getDeletRequest(currentUser: UserInfo, req: Request): TDeletRequest;

    @ApiRoute({
        method: ApiMethod.POST,
        path: ClientRoutes.GenericController.actionPaths['search']
    })
    public async search(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = me.getSearchRequest(me.currentUser(), req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.businessService.search(request);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.GenericController.actionPaths['search']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.GET,
        path: ClientRoutes.GenericController.actionPaths['getById']
    })
    public async getById(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = me.getGetByIdRequestRequest(me.currentUser(), req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.businessService.getById(request);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.GenericController.actionPaths['getById']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.POST,
        path: ClientRoutes.GenericController.actionPaths['create']
    })
    public async create(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = me.getCreateRequest(me.currentUser(), req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.businessService.create(request);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.GenericController.actionPaths['create']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.PUT,
        path: ClientRoutes.GenericController.actionPaths['update']
    })
    public async update(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = me.getUpdateRequest(me.currentUser(), req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.businessService.update(request);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.GenericController.actionPaths['update']);
            res.json((ex as AppError).exception);
        }
    }

    @ApiRoute({
        method: ApiMethod.DELETE,
        path: ClientRoutes.GenericController.actionPaths['delete']
    })
    public async delete(req: Request, res: Response): Promise<void> {
        const me = this;
        try {
            const request = me.getDeletRequest(me.currentUser(), req);
            if (!request.isValid()) {
                throw new AppError(request.currentError as ErrorResponse);
            }
            const response = await me.businessService.delete(request);
            res.status(StatusCode.Ok);
            res.json(response);
        }
        catch (ex) {
            me.logger.logError(ex, me.controllerName, ClientRoutes.GenericController.actionPaths['delete']);
            res.json((ex as AppError).exception);
        }
    }
}