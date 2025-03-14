import { container } from 'tsyringe';
import { LoggingClientService } from '../logic/loggingClient.Service';
import { PocketBaseApi } from '../../common/constants/pocketBaseApi';
import { PocketBaseCreateRequest, PocketBaseDeleteRequest, PocketBaseGetByIdRequest, PocketBaseSearchRequest, PocketBaseUpdateRequest } from './requests/baseRequest.PocketBase';
import { PocketBaseItem, PocketBaseSearchResponse } from './responses/baseResponse.PocketBase';
import { ConstantValue } from '../../common/constants/constant';
import { PocketBaseErrorResponse } from './responses/errorResponse.PocketBase';
import { ObjectHelper } from '../../common/functions/objectHelper';
import { AnyType } from 'typescript-express-basic';

export abstract class BasePocketBaseService {
    /**
        * Service name
        * Example: "nameService"
        */
    public abstract collectionName: string;

    /**
     * Log service
     */
    public logger = container.resolve(LoggingClientService);

    /**
     * PocketBase Api
     */
    private readonly pocketBaseApi = container.resolve(PocketBaseApi);

    /**
     * PocketBase
     */
    public pocketBase = this.pocketBaseApi.client;

    /**
     * Get public file url
     * @param record 
     * @param fileName 
     * @returns 
     */
    public async getPublicFileUrl(record: { [key: string]: AnyType; }, fileName: string): Promise<string> {
        const me = this;
        const fileUrl = me.pocketBase.files.getURL(record, fileName);
        return fileUrl;
    }

    /**
     * Get private file url
     * @param record 
     * @param fileName 
     * @returns 
     */
    public async getPrivateFileUrl(record: { [key: string]: AnyType; }, fileName: string): Promise<string> {
        const me = this;
        const fileToken = await me.pocketBase.files.getToken();
        const fileUrl = me.pocketBase.files.getURL(record, fileName, { 'token': fileToken });
        return fileUrl;
    }
}

/**
 * Base pocketbase service
 */
export abstract class BasePocketDataBaseService
    <
        TSearchRequest extends PocketBaseSearchRequest,
        TGetByIdRequest extends PocketBaseGetByIdRequest,
        TCreateRequest extends PocketBaseCreateRequest,
        TUpdateRequest extends PocketBaseUpdateRequest,
        TDeleteReqeust extends PocketBaseDeleteRequest,
        TEntityResponse extends PocketBaseItem
    > extends BasePocketBaseService {

    /**
     * Search in pocketbase
     * @param request 
     * @returns 
     */
    public async search(request: TSearchRequest): Promise<PocketBaseSearchResponse<TEntityResponse>> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.userInfo?.token ? request.userInfo?.token : '');
            const response = {} as PocketBaseSearchResponse<TEntityResponse>;
            response.items = [];
            const pocketPageDataList = await me.pocketBase.collection(me.collectionName).getList<TEntityResponse>(
                request.page ? request.page : ConstantValue.pageIndex,
                request.perPage ? request.perPage : ConstantValue.pageSize,
                {
                    sort: request.sort ? request.sort : '',
                    filter: request.filter ? request.filter : '',
                    expand: request.expand ? request.expand : '',
                    fields: request.fields ? request.fields : '',
                    skipTotal: request.skipTotal ? request.skipTotal : false,
                }
            );
            for (const item of pocketPageDataList.items) {
                response.items.push(item);
            }
            response.page = request.page;
            response.perPage = request.perPage;
            response.totalItems = pocketPageDataList.totalItems;
            response.totalPages = pocketPageDataList.totalPages;
            return response;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Get by id in pocketbase
     * @param request 
     * @returns 
     */
    public async getById(request: TGetByIdRequest): Promise<TEntityResponse> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.userInfo?.token ? request.userInfo?.token : '');
            let response = {} as TEntityResponse;
            const pocketPageData = await me.pocketBase.collection(me.collectionName).getOne<TEntityResponse>(
                request.id ? request.id : '',
                {
                    expand: request.expand ? request.expand : '',
                    fields: request.fields ? request.fields : '',
                }
            );
            response = pocketPageData;
            return response;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Create item in pocketbase
     * @param request 
     * @returns 
     */
    public async create(request: TCreateRequest): Promise<TEntityResponse> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.userInfo?.token ? request.userInfo?.token : '');
            request.isDeleted = false;
            const pocketPageData = await me.pocketBase.collection(me.collectionName).create<TEntityResponse>(request, {
                expand: request.expand ? request.expand : '',
                fields: request.fields ? request.fields : '',
            });
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Update item in pocketbase
     * @param request 
     * @returns 
     */
    public async update(request: TUpdateRequest): Promise<TEntityResponse> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.userInfo?.token ? request.userInfo?.token : '');
            const pocketPageData = await me.pocketBase.collection(me.collectionName).getOne<TEntityResponse>(request.id,
                {
                    expand: request.expand ? request.expand : '',
                    fields: request.fields ? request.fields : '',
                }
            );
            pocketPageData.isDeleted = false;
            const updateData = ObjectHelper.map(request, pocketPageData);
            const updateDataResponse = await me.pocketBase.collection(me.collectionName).update<TEntityResponse>(request.id, updateData, {
                expand: request.expand ? request.expand : '',
                fields: request.fields ? request.fields : '',
            });
            return updateDataResponse;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Delete item in pocketbase
     * @param request 
     * @param softDelete 
     * @returns 
     */
    public async delete(request: TDeleteReqeust, softDelete = true): Promise<TEntityResponse> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.userInfo?.token ? request.userInfo?.token : '');
            const pocketPageData = await me.pocketBase.collection(me.collectionName).getOne<TEntityResponse>(request.id,
                {
                    expand: request.expand ? request.expand : '',
                    fields: request.fields ? request.fields : '',
                }
            );
            if (softDelete) {
                pocketPageData.isDeleted = true;
                await me.pocketBase.collection(me.collectionName).update<TEntityResponse>(request.id, pocketPageData, {
                    expand: request.expand ? request.expand : '',
                    fields: request.fields ? request.fields : '',
                });
            }
            else {
                const deleteResult = await me.pocketBase.collection(me.collectionName).delete(request.id);
                pocketPageData.isDeleted = deleteResult;
            }
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }
}