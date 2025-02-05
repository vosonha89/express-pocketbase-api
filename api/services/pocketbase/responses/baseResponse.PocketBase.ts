import { AnyType } from 'typescript-express-basic';

export interface PocketBaseSearchResponse<T extends PocketBaseItem> {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    items: T[];
}

export interface PocketBaseItem {
    collectionId: string;
    collectionName: string;
    id: string;
    isDeleted: boolean;
    created: Date;
    updated: Date;
    expand: ExpandObject;
}


export interface ExpandObject extends AnyType {
    [key: string]: AnyType;
}