import { AuthPocketBaseAdminRecord, AuthPocketBaseRecord } from '../../services/pocketbase/responses/auth.Response.PocketBase';
import { GenericObject } from '../abstractions/genericObject.type';

export class UserInfo extends GenericObject<AuthPocketBaseRecord> {
    public id = '';
    public email = '';
    public emailVisibility = false;
    public verified = false;
    public name = '';
    public avatar = '';
    public isActive = false;
    public isAdminUser = false;

    /**
     * External fields
     */
    public extToken?: string;

    public override map(object: AuthPocketBaseRecord): void {
        super.map(object);
        this.isAdminUser = false;
    }
}

export class UserAdminInfo extends UserInfo {
    public role = '';
    public permissions = '';

    public override map(object: AuthPocketBaseAdminRecord): void {
        super.map(object);
        this.isAdminUser = true;
    }
}