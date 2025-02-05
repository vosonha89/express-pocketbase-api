import 'dotenv/config';

/**
 * App environment. Read data from .env file
 */
class Environment {
    public readonly PORT = process.env.PORT ? process.env.PORT : 3000;
    public readonly ENV = process.env.ENV ? process.env.ENV : '';
    public readonly VERSION = process.env.PORT ? process.env.VERSION : '';
    public readonly POCKETPAGE_URL = process.env.POCKETPAGE_URL ? process.env.POCKETPAGE_URL : '';
    public readonly APPKEY = process.env.APPKEY ? process.env.APPKEY : '';
    public readonly TOKENEXP = process.env.TOKENEXP ? process.env.TOKENEXP : 1728000;
    public readonly ADMIN_TOKEN = process.env.ADMIN_TOKEN ? process.env.ADMIN_TOKEN : '';
    public readonly API_HOSTNAME = process.env.API_HOSTNAME ? process.env.API_HOSTNAME : '';
    public readonly PRIVATEKEY = process.env.PRIVATEKEY ? process.env.PRIVATEKEY : '';
    public readonly PUBLICKEY = process.env.PUBLICKEY ? process.env.PUBLICKEY : '';
}

export const AppEnvironment = new Environment();