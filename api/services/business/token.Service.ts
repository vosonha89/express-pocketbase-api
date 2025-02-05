import { AnyType } from 'typescript-express-basic';
import fs from "fs";
import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { AppEnvironment } from '../../common/constants/environment';

/**
 * Token service
 */
@injectable()
export class TokenService {
    /**
     * Create token
     * @param payload 
     * @param expiresIn seconds
     * @returns 
     */
    public createToken(payload: AnyType, expiresIn: number): string {
        const me = this;
        const privateKey = me.getPrivateKey();
        const token = jwt.sign({ ...payload }, privateKey, { algorithm: "RS256", expiresIn: expiresIn });
        return token;
    }

    /**
     * Verify token
     * @param token 
     * @returns 
     */
    public verifyToken(token: string): jwt.JwtPayload | undefined {
        const me = this;
        const verifyData = jwt.verify(token, me.getPublicKey());
        if (typeof verifyData == 'string') {
            return undefined;
        }
        return verifyData;
    }

    /**
     * Get privaty key
     * @returns 
     */
    public getPrivateKey(): AnyType {
        let keyString = AppEnvironment.PRIVATEKEY;
        if (!keyString) {
            const key = fs.readFileSync('./keys/private.key');
            return key;
        }
        else {
            keyString = keyString.replace('-----BEGIN RSA PRIVATE KEY-----', '');
            keyString = keyString.replace('-----END RSA PRIVATE KEY-----', '');
            keyString = '-----BEGIN RSA PRIVATE KEY-----\n' + keyString.replace(' ', '\n') + '\n-----END RSA PRIVATE KEY-----';
            return keyString;
        }
    }

    /**
    * Get public key
    * @returns 
    */
    public getPublicKey(): AnyType {
        let keyString = AppEnvironment.PUBLICKEY;
        if (!keyString) {
            const key = fs.readFileSync('./keys/public.key');
            return key;
        }
        else {
            keyString = keyString.replace('-----BEGIN PUBLIC KEY-----', '');
            keyString = keyString.replace('-----END PUBLIC KEY-----', '');
            keyString = '-----BEGIN PUBLIC KEY-----\n' + keyString.replace(' ', '\n') + '\n-----END PUBLIC KEY-----';
            return keyString;
        }
    }
}