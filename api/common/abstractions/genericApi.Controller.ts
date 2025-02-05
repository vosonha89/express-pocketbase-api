import { container } from 'tsyringe';
import { LoggingClientService } from '../../services/logic/loggingClient.Service';
import { AnyType, ApiController } from 'typescript-express-basic';
import { AuthFilterService } from '../services/authFilter.Service';
import { UserAdminInfo, UserInfo } from '../types/authType';
import { LoggingAdminService } from '../../services/logic/loggingAdmin.Service';

export abstract class GenericApiController extends ApiController {
    /**
     * Controller name
     */
    public abstract readonly controllerName: string;
    protected abstract logger: AnyType;
    /**
     * Auth filter service
     */
    protected authFilter = container.resolve(AuthFilterService);
}


export abstract class GenericAdminApiController extends GenericApiController {
    /**
    * Log service
    */
    protected logger = container.resolve(LoggingAdminService);

    protected currentUser(): UserAdminInfo {
        return this.authFilter.getCurrentUser(true) as UserAdminInfo;
    }
}

export abstract class GenericClientApiController extends GenericApiController {
    /**
     * Log service
     */
    protected logger = container.resolve(LoggingClientService);

    protected currentUser(): UserInfo {
        return this.authFilter.getCurrentUser(false) as UserInfo;
    }
}