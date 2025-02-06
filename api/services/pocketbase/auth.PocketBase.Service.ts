import { BasePocketBaseService } from './base.PocketBase.service';
import { LoginAdminRequest, LoginClientRequest, RefreshTokenRequest } from './requests/auth.Request.PocketBase';
import { AuthPocketBase, AuthPocketBaseAdminRecord, AuthPocketBaseRecord, AuthProviderInfo } from './responses/auth.Response.PocketBase';
import { PocketBaseErrorResponse } from './responses/errorResponse.PocketBase';
import { AppEnvironment } from '../../common/constants/environment';

/**
 * Auth pocketbase service
 */
export class AuthPocketBaseService extends BasePocketBaseService {
    public collectionName = 'users';
    public superusersCollection = '_superusers';

    /**
     * Login admin with password
     * @param request 
     * @returns 
     */
    public async loginAdminWithPassword(request: LoginAdminRequest): Promise<AuthPocketBase<AuthPocketBaseAdminRecord>> {
        const me = this;
        try {
            const pocketPageData = await me.pocketBase.collection(me.superusersCollection).authWithPassword<AuthPocketBaseAdminRecord>(request.email, request.password);
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Login client with password
     * @param request 
     * @returns 
     */
    public async loginClientWithPassword(request: LoginClientRequest): Promise<AuthPocketBase<AuthPocketBaseRecord>> {
        const me = this;
        try {
            const pocketPageData = await me.pocketBase.collection(me.collectionName).authWithPassword<AuthPocketBaseRecord>(request.email, request.password);
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Refresh admin token
     * @param request 
     * @returns 
     */
    public async refreshAdminToken(request: RefreshTokenRequest): Promise<AuthPocketBase<AuthPocketBaseAdminRecord>> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.refreshToken ? request.refreshToken : '');
            const pocketPageData = await me.pocketBase.collection(me.superusersCollection).authRefresh<AuthPocketBaseAdminRecord>();
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Refresh client token
     * @param request 
     * @returns 
     */
    public async refreshClientToken(request: RefreshTokenRequest): Promise<AuthPocketBase<AuthPocketBaseRecord>> {
        const me = this;
        try {
            me.pocketBase.authStore.save(request.refreshToken ? request.refreshToken : '');
            const pocketPageData = await me.pocketBase.collection(me.collectionName).authRefresh<AuthPocketBaseRecord>();
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Get social provider and login
     * @param provider 
     * @returns 
     */
    public async loginClientSocial(provider: string): Promise<AuthProviderInfo | undefined> {
        const me = this;
        try {
            const pocketPageData = await me.pocketBase.collection(me.collectionName).listAuthMethods();
            if (pocketPageData?.oauth2?.enabled) {
                const providerInfo = pocketPageData.oauth2.providers.find(a => a.name == provider);
                return providerInfo;
            }
            return undefined;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }

    /**
     * Auth with social code
     * @param provider 
     * @param code 
     * @param codeVerifier 
     * @param redirectUrl 
     * @returns 
     */
    public async loginClientWithOAuth2Code(provider: string, code: string, codeVerifier: string, redirectUrl: string): Promise<AuthPocketBase<AuthPocketBaseRecord>> {
        const me = this;
        try {
            const adminToken = AppEnvironment.ADMIN_TOKEN;
            me.pocketBase.authStore.save(adminToken);
            const pocketPageData = await me.pocketBase.collection(me.collectionName).authWithOAuth2Code<AuthPocketBaseRecord>(
                provider,
                code,
                codeVerifier,
                redirectUrl
            );
            return pocketPageData;
        }
        catch (ex) {
            const error = ex as PocketBaseErrorResponse;
            throw new Error(error.message);
        }
    }
}