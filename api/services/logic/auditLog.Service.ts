import "reflect-metadata";
import { injectable } from 'tsyringe';
import { CommonFunctions } from 'typescript-express-basic';

/**
 * Audit log type
 */
export class AuditLogType {
    public static readonly update = 'Update';
    public static readonly delete = 'Delete';
}
/**
 * Audit Log
 */
export class AuditLog {
    public id!: string;
    public collection: string;
    public userId: string;
    public type: AuditLogType;
    public oldData: string;
    public newData: string;
    public createdDate: Date;

    /**
     * Constructor
     */
    constructor(collection: string, userId: string, type: AuditLogType, oldData: string, newData: string) {
        this.id = CommonFunctions.uuidv4();
        this.collection = collection;
        this.userId = userId;
        this.type = type;
        this.oldData = oldData;
        this.newData = newData;
        this.createdDate = new Date
    }
}

/**
 * Audit log service
 */
@injectable()
export class AuditLogService {
    /**
     * Log update data
     * @param collection 
     * @param userId 
     * @param oldData 
     * @param newData 
     */
    public logUpdate<T>(collection: string, userId: string, oldData: T, newData: T): void {
        const auditLog = new AuditLog(collection, userId, AuditLogType.update, JSON.stringify(oldData), JSON.stringify(newData));
        console.log(JSON.stringify(auditLog));
    }

    /**
     * Log delete data
     * @param collection 
     * @param userId 
     * @param oldData 
     */
    public logDelete<T>(collection: string, userId: string, oldData: T): void {
        const auditLog = new AuditLog(collection, userId, AuditLogType.delete, JSON.stringify(oldData), '');
        console.log(JSON.stringify(auditLog));
    }
}