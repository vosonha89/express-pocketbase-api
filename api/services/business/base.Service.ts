import { GenericService, IGenericService } from '../../common/abstractions/generic.Business';
import { ErrorResponse, InternalServerError } from '../../common/responses/errorResponse';
import { BaseResponseData, BaseSearchResponse, OKResponse } from '../../common/responses/baseResponse';
import { StatusCode } from 'typescript-express-basic';
import { PocketBaseCreateRequest, PocketBaseDeleteRequest, PocketBaseGetByIdRequest, PocketBaseSearchRequest, PocketBaseUpdateRequest, setUserInfo } from '../pocketbase/requests/baseRequest.PocketBase';
import { BasePocketDataBaseService } from '../pocketbase/base.PocketBase.service';
import { PocketBaseItem } from '../pocketbase/responses/baseResponse.PocketBase';
import { BaseCreateRequest, BaseDeleteRequest, BaseGetById, BaseSearchRequest, BaseUpdateRequest } from '../../common/requests/baseRequest';
import { GenericObject } from '../../common/abstractions/genericObject.type';
import { ILogging } from '../logic/logging.Service';

/**
 * Abstract admin service
 */
export abstract class BaseService
    <
        TPocketBaseService extends BasePocketDataBaseService<TPocketBaseSearchRequest, TPocketBaseGetByIdRequest, TPocketBaseCreateRequest, TPocketBaseUpdateRequest, TPocketBaseDeleteRequest, TPocketBaseEntityResponse>,
        TPocketBaseSearchRequest extends PocketBaseSearchRequest,
        TPocketBaseGetByIdRequest extends PocketBaseGetByIdRequest,
        TPocketBaseCreateRequest extends PocketBaseCreateRequest,
        TPocketBaseUpdateRequest extends PocketBaseUpdateRequest,
        TPocketBaseDeleteRequest extends PocketBaseDeleteRequest,
        TPocketBaseEntityResponse extends PocketBaseItem,
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
        TEntity extends GenericObject<TPocketBaseEntityResponse>
    >
    extends GenericService
    implements IGenericService<
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
        TPocketBaseEntityResponse
    > {
    protected abstract serviceName: string;
    protected abstract logger: ILogging;
    protected abstract logicPocketBaseService: TPocketBaseService;
    protected abstract getEntity(): TEntity;
    protected abstract getSearchEntity(): TPocketBaseSearchRequest;
    protected abstract getGetByIdEntity(): TPocketBaseGetByIdRequest;
    protected abstract getCreateEntity(): TPocketBaseCreateRequest;
    protected abstract getUpdateEntity(): TPocketBaseUpdateRequest;
    protected abstract getDeleteEntity(): TPocketBaseDeleteRequest;

    /**
     * Search
     * @param request 
     * @returns 
     */
    public async search(request: TSearchRequest): Promise<TSearchResponse | ErrorResponse> {
        const me = this;
        try {
            // Create filter
            const filterContent: string[] = [];
            for (const element of request.filters) {
                filterContent.push(element.fieldName + element.filterCondition + "'" + element.fieldValue + "'");
            }
            let filter = '';
            if (filterContent && filterContent.length > 0) {
                filter = "(" + filterContent.join(' && ') + ")";
            }
            // Create sort
            let sortContent = '';
            if (request.sort.sortType == 'DESC') {
                sortContent += '-';
            }
            sortContent += request.sort.sortField;
            const sort = sortContent;
            // Create pocketbase request
            const pocketBaseRequest = me.getSearchEntity();
            pocketBaseRequest.page = request.page;
            pocketBaseRequest.perPage = request.size;
            pocketBaseRequest.filter = filter;
            pocketBaseRequest.sort = sort;
            setUserInfo(pocketBaseRequest, request.currentUser);
            const pocketBaseResponse = await me.logicPocketBaseService.search(pocketBaseRequest);
            const data = {} as BaseSearchResponse<TEntity>;
            data.elements = pocketBaseResponse.items.map((pbItem) => {
                const item = me.getEntity();
                item.map(pbItem);
                return item;
            });
            data.totalElements = pocketBaseResponse.totalItems;
            data.totalPages = pocketBaseResponse.totalPages;
            data.page = request.page;
            data.size = request.size;
            const response = OKResponse(data);
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'search');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
    * Get by id
    * @param request 
    * @returns 
    */
    public async getById(request: TGetByIdRequestRequest): Promise<TGetByIdResponse | ErrorResponse> {
        const me = this;
        try {
            // Create pocketbase request
            const pocketBaseRequest = me.getGetByIdEntity();
            pocketBaseRequest.id = request.id;
            setUserInfo(pocketBaseRequest, request.currentUser);
            const pocketBaseResponse = await me.logicPocketBaseService.getById(pocketBaseRequest);
            const dataResponse = me.getEntity();
            dataResponse.map(pocketBaseResponse);
            const response = OKResponse(dataResponse);
            return response;

        } catch (ex) {
            me.logger.logError(ex, me.serviceName, 'getById');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Create
     * @param request 
     * @returns 
     */
    public async create(request: TCreateRequest): Promise<TCreateResponse | ErrorResponse> {
        const me = this;
        try {
            // Create pocketbase request
            const pocketBaseRequest = me.getCreateEntity();
            pocketBaseRequest.map(request);
            setUserInfo(pocketBaseRequest, request.currentUser);
            const pocketBaseResponse = await me.logicPocketBaseService.create(pocketBaseRequest);
            const dataResponse = me.getEntity();
            dataResponse.map(pocketBaseResponse);
            const response = OKResponse(dataResponse);
            return response;
        }
        catch (ex) {
            me.logger.logError(ex, me.serviceName, 'create');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Update
     * @param request 
     * @returns 
     */
    public async update(request: TUpdateRequest): Promise<TUpdateResponse | ErrorResponse> {
        const me = this;
        try {
            // Create pocketbase request
            const pocketBaseRequest = me.getUpdateEntity();
            pocketBaseRequest.map(request);
            setUserInfo(pocketBaseRequest, request.currentUser);
            const pocketBaseResponse = await me.logicPocketBaseService.update(pocketBaseRequest);
            const dataResponse = me.getEntity();
            dataResponse.map(pocketBaseResponse);
            const response = OKResponse(dataResponse);
            return response;
        }
        catch (ex) {
            me.logger.logError(ex, me.serviceName, 'update');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }

    /**
     * Delete
     * @param request 
     * @returns 
     */
    public async delete(request: TDeletRequest): Promise<TDeleteResponse | ErrorResponse> {
        const me = this;
        try {
            // Create pocketbase request
            const pocketBaseRequest = me.getDeleteEntity();
            pocketBaseRequest.id = request.id;
            setUserInfo(pocketBaseRequest, request.currentUser);
            const pocketBaseResponse = await me.logicPocketBaseService.delete(pocketBaseRequest);
            const dataResponse = me.getEntity();
            dataResponse.map(pocketBaseResponse);
            const response = OKResponse(dataResponse);
            return response;
        }
        catch (ex) {
            me.logger.logError(ex, me.serviceName, 'delete');
            return InternalServerError({
                errorCode: StatusCode.InternalServerError.toString(),
                errorMessage: (ex as Error).message
            });
        }
    }
}