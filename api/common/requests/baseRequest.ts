import { Request } from 'express';
import { ConstantValue, FilterCondition } from '../constants/constant';
import { UserInfo } from '../types/authType';
import { GlobalError } from '../../errors/globalError';
import { BadRequest, ErrorResponse } from '../responses/errorResponse';
import { ClientError } from '../types/errorType';
import validator from 'validator';

/**
 * Base filter
 */
export interface BaseFilter {
    fieldName: string;
    fieldValue: string;
    filterCondition: FilterCondition;
}

/**
 * Base sort
 */
export interface BaseSort {
    sortField: string;
    sortType: 'DESC' | 'ASC';
}

/**
 * Base request from client side
 */
export abstract class BaseRequest {
    public currentError?: ErrorResponse;
    /**
       * Map request from client side
       * @param req 
       */
    public abstract mapRequest(req: Request): void;

    /**
     * Check request is valid
     */
    public abstract isValid(): boolean;
}

/**
 * Base authorized request from client side
 */
export abstract class BaseAuthorizedRequest extends BaseRequest {
    public currentUser: UserInfo;

    /**
     *
     */
    constructor(currentUser: UserInfo) {
        super();
        this.currentUser = currentUser;
    }
}

/**
 * Base search request
 */
export abstract class BaseSearchRequest extends BaseAuthorizedRequest {
    public page!: number;
    public size!: number;
    public filters!: BaseFilter[];
    public sort!: BaseSort;

    /**
     * Constructor
     */
    constructor(currentUser: UserInfo, req: Request) {
        super(currentUser);
        this.page = ConstantValue.pageIndex;
        this.size = ConstantValue.pageSize;
        this.filters = [];
        this.sort = {
            sortField: 'created',
            sortType: 'DESC'
        };
        this.mapRequest(req);
    }

    /**
     * Map request from client side
     * @param req 
     */
    public mapRequest(req: Request): void {
        const me = this;
        if (req.body.page) {
            me.page = req.body.page;
        }
        if (req.body.size) {
            me.size = req.body.size;
        }
        if (req.body.filters) {
            me.filters = req.body.filters;
        }
        if (req.body.sort) {
            me.sort = req.body.sort;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.page) {
            const error = GlobalError.RequiredError('Page');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        else if (!validator.isNumeric(me.page.toString())) {
            const error = GlobalError.TypeError('Page', 'number');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        if (!me.size) {
            const error = GlobalError.RequiredError('Size');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        else if (!validator.isNumeric(me.size.toString())) {
            const error = GlobalError.TypeError('Size', 'number');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

/**
 * Base get by id request
 */
export abstract class BaseGetById extends BaseAuthorizedRequest {
    public id!: string;

    /**
    * Constructor
    */
    constructor(currentUser: UserInfo, req: Request) {
        super(currentUser);
        this.mapRequest(req);
    }

    public mapRequest(req: Request): void {
        const me = this;
        if (req.query.id) {
            me.id = req.query.id as string;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.id) {
            const error = GlobalError.RequiredError('Id');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

/**
 * Base create request
 */
export abstract class BaseCreateRequest extends BaseAuthorizedRequest {
    /**
    * Constructor
    */
    constructor(currentUser: UserInfo, req: Request) {
        super(currentUser);
        this.mapRequest(req);
    }
}

/**
 * Base edit request
 */
export abstract class BaseUpdateRequest extends BaseAuthorizedRequest {
    public id!: string;
    /**
    * Constructor
    */
    constructor(currentUser: UserInfo, req: Request) {
        super(currentUser);
        this.mapRequest(req);
    }

    public mapRequest(req: Request): void {
        const me = this;
        if (req.query.id) {
            me.id = req.query.id as string;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.id) {
            const error = GlobalError.RequiredError('Id');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}

/**
 * Base delete request
 */
export abstract class BaseDeleteRequest extends BaseAuthorizedRequest {
    public id!: string;
    public readonly softDelete = true;
    /**
    * Constructor
    */
    constructor(currentUser: UserInfo, req: Request) {
        super(currentUser);
        this.mapRequest(req);
    }

    public mapRequest(req: Request): void {
        const me = this;
        if (req.query.id) {
            me.id = req.query.id as string;
        }
    }

    public isValid(): boolean {
        const me = this;
        if (!me.id) {
            const error = GlobalError.RequiredError('Id');
            me.currentError = BadRequest({ errorCode: error.code.toString(), errorMessage: error.msg } as ClientError);
            return false;
        }
        return true;
    }
}