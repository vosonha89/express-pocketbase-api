/**
 * Application constant value
 */
export class ConstantValue {
    public static readonly pageIndex = 1;
    public static readonly pageSize = 10;
}

/**
 * Filter condition
 */
export enum FilterCondition {
    Like = '~',
    Equal = '=',
    NotEqual = '!=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    LessThan = '<',
    LessThanOrEqual = '<=',
}