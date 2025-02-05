import { BaseResponseData } from '../../../common/responses/baseResponse';
import { UserAdminInfo } from '../../../common/types/authType';

/**
 * LoginResponse type
 * @typedef {object} LoginResponse
 * @property {string} serverDateTime - 
 * @property {number} status - 
 * @property {string} msg - 
 * @property {string} exception - 
 * @property {boolean} successful - 
 * @property {object} data - 
 */
export class LoginResponse extends BaseResponseData<LoginInfo> {
}

export interface LoginInfo {
    accessToken: string;
    expireTime: number;
    refreshToken: string;
    profile: UserAdminInfo;
}