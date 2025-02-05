import PocketBase from 'pocketbase/cjs';
import { singleton } from 'tsyringe';
import { AppEnvironment } from './environment';

@singleton()
export class PocketBaseApi {
    /**
     * Pocket base url
     */
    public readonly pocketBaseUrl = AppEnvironment.POCKETPAGE_URL;

    public client: PocketBase = new PocketBase(this.pocketBaseUrl);

    public async init(): Promise<void> {
        this.client = new PocketBase(this.pocketBaseUrl);
    }
}