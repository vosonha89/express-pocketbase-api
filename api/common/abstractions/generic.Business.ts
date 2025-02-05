import { container } from 'tsyringe';
import { AuthFilterService } from '../services/authFilter.Service';
import { ErrorResponse } from '../responses/errorResponse';
import { BaseCreateRequest, BaseDeleteRequest, BaseGetById, BaseSearchRequest, BaseUpdateRequest } from '../requests/baseRequest';
import { BaseResponseData, BaseSearchResponse } from '../responses/baseResponse';
import { GenericObject } from './genericObject.type';
import { PocketBaseItem } from '../../services/pocketbase/responses/baseResponse.PocketBase';
import { ILogging } from '../../services/logic/logging.Service';

export interface IGenericService<
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
> {
    search(request: TSearchRequest): Promise<TSearchResponse | ErrorResponse>;
    getById(request: TGetByIdRequestRequest): Promise<TGetByIdResponse | ErrorResponse>;
    create(request: TCreateRequest): Promise<TCreateResponse | ErrorResponse>;
    update(request: TUpdateRequest): Promise<TUpdateResponse | ErrorResponse>;
    delete(request: TDeletRequest): Promise<TDeleteResponse | ErrorResponse>;
}

/**
 * Generic service
 */
export abstract class GenericService {
    protected abstract serviceName: string;
    protected abstract logger: ILogging;
    /**
     * Auth filter service
     */
    protected authFilter = container.resolve(AuthFilterService);

    protected currentUser() {
        return this.authFilter.getCurrentUser();
    }
}