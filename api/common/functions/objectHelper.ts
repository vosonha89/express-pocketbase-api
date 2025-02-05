import { AnyType } from 'typescript-express-basic';

/**
 * Object helper class
 */
export class ObjectHelper {
    /**
     * Mapping data
     * @param source 
     * @param dest 
     */
    public static map(source: AnyType, dest: AnyType): AnyType {
        const keys = Object.getOwnPropertyNames(dest);
        for (const key of keys) {
            if (source[key]) {
                dest[key] = JSON.parse(JSON.stringify(source[key]));
            }
        }
        return dest;
    }
}