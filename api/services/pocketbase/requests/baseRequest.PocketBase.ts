import { AnyType } from 'typescript-express-basic';
import { UserInfo as ClientUserInfo } from '../../../common/types/authType';
import { ConstantValue } from '../../../common/constants/constant';
import { ObjectHelper } from '../../../common/functions/objectHelper';
import { BaseSearchRequest } from '../../../common/requests/baseRequest';

/**
 * User info for PocketBase
 */
export interface UserInfo {
    id: string;
    email: string;
    token: string;
    model?: AnyType;
}

/**
 * PocketBase request
 */
export abstract class PocketBaseRequest {
    public userInfo?: UserInfo;
    public isDeleted?: boolean = false;
    public expand: string = '';
    public fields: string = '';
}

/**
 * PocketBase modify request
 */
export abstract class PocketBaseModifyRequest extends PocketBaseRequest {
    public map(source: AnyType): void {
        ObjectHelper.map(source, this);
    }
}

/**
 * PocketBase search request
 */
export abstract class PocketBaseSearchRequest extends PocketBaseRequest {
    public page: number = ConstantValue.pageIndex;
    public perPage: number = ConstantValue.pageSize;
    public sort: string = '';
    public filter: string = '';
    public skipTotal: boolean = false;

    /**
     * Apply request from logic serivce
     * @param request 
     */
    public applyQuery(request: BaseSearchRequest): void {
        const me = this;
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

        me.page = request.page;
        me.perPage = request.size;
        me.filter = filter;
        me.sort = sort;
    }
}

/**
 * PocketBase get by id request
 */
export abstract class PocketBaseGetByIdRequest extends PocketBaseRequest {
    public id: string = '';
}

/**
 * PocketBase create request
 */
export abstract class PocketBaseCreateRequest extends PocketBaseModifyRequest {
}

/**
 * PocketBase update request
 */
export abstract class PocketBaseUpdateRequest extends PocketBaseModifyRequest {
    public id: string = '';
}

/**
 * PocketBase delete request
 */
export abstract class PocketBaseDeleteRequest extends PocketBaseRequest {
    public id: string = '';
}

/**
 * Set user information before request to pocketbase
 * @param pocketBaseRequest 
 * @param clientUserInfo 
 */
export const setUserInfo = (pocketBaseRequest: PocketBaseRequest, clientUserInfo: ClientUserInfo) => {
    pocketBaseRequest.userInfo = clientUserInfo ? {
        id: clientUserInfo.id,
        email: clientUserInfo.email,
        token: clientUserInfo.extToken,
    } as UserInfo : undefined;
}