import { AnyType } from 'typescript-express-basic';
import { PocketBaseItem } from './baseResponse.PocketBase';

export interface AuthPocketBase<T> {
    token: string;
    record: T;
    meta?: AnyType;
}


export interface AuthPocketBaseRecord extends PocketBaseItem  {
    email: string;
    emailVisibility: boolean;
    verified: boolean;
    name: string,
    avatar: string,
    isActive: boolean
}

export interface AuthPocketBaseAdminRecord extends AuthPocketBaseRecord  {
    roles: string;
    permissions: string;
}

export interface AuthProviderInfo {
    name: string;
    displayName: string;
    state: string;
    authURL: string;
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: string;
}