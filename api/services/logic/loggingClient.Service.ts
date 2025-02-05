import "reflect-metadata";
import { injectable } from 'tsyringe';
import { ILogging } from './logging.Service';

/**
 * Log service
 */
@injectable()
export class LoggingClientService implements ILogging {
    /**
     * Log info
     * @param info 
     * @param objectType 
     * @param method 
     */
    public logInfo<T>(info: T, objectType: string, method: string): void {
        const logInfo = {
            objectType: objectType,
            method: method,
            msg: JSON.stringify(info),
            type: 'info'
        };
        console.log(JSON.stringify(logInfo));
    }

    /**
     * Log warning
     * @param info 
     * @param objectType 
     * @param method 
     */
    public logWarning<T>(info: T, objectType: string, method: string): void {
        const logInfo = {
            objectType: objectType,
            method: method,
            msg: JSON.stringify(info),
            type: 'warning'
        };
        console.log(JSON.stringify(logInfo));
    }

    /**
     * Log error
     * @param error 
     * @param objectType 
     * @param method 
     */
    public logError<T extends Error | unknown>(error: T, objectType: string, method: string): void {
        const logError = {
            objectType: objectType,
            method: method,
            name: (error as Error).name,
            msg: (error as Error).message,
            stack: (error as Error).stack,
            type: 'error'
        };
        console.log(JSON.stringify(logError));
    }
}