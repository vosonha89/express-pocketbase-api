import { BaseResponseData, BaseSearchResponse } from '../../../common/responses/baseResponse';
import { PocketBaseCreateRequest, PocketBaseDeleteRequest, PocketBaseGetByIdRequest, PocketBaseSearchRequest, PocketBaseUpdateRequest } from '../../pocketbase/requests/baseRequest.PocketBase';
import { BasePocketDataBaseService } from '../../pocketbase/base.PocketBase.service';
import { PocketBaseItem } from '../../pocketbase/responses/baseResponse.PocketBase';
import { BaseCreateRequest, BaseDeleteRequest, BaseGetById, BaseSearchRequest, BaseUpdateRequest } from '../../../common/requests/baseRequest';
import { GenericObject } from '../../../common/abstractions/genericObject.type';
import { BaseService } from '../base.Service';
import { container } from 'tsyringe';
import { LoggingAdminService } from '../../logic/loggingAdmin.Service';

/**
 * Abstract admin service
 */
export abstract class BaseAdminService
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
    extends BaseService<
        TPocketBaseService,
        TPocketBaseSearchRequest,
        TPocketBaseGetByIdRequest,
        TPocketBaseCreateRequest,
        TPocketBaseUpdateRequest,
        TPocketBaseDeleteRequest,
        TPocketBaseEntityResponse,
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
        TEntity
    > {
    protected abstract serviceName: string;
    protected logger = container.resolve(LoggingAdminService);
    protected abstract logicPocketBaseService: TPocketBaseService;
    protected abstract getEntity(): TEntity;
    protected abstract getSearchEntity(): TPocketBaseSearchRequest;
    protected abstract getGetByIdEntity(): TPocketBaseGetByIdRequest;
    protected abstract getCreateEntity(): TPocketBaseCreateRequest;
    protected abstract getUpdateEntity(): TPocketBaseUpdateRequest;
    protected abstract getDeleteEntity(): TPocketBaseDeleteRequest;
}