import { AnyType } from 'typescript-express-basic';

export interface PocketBaseGenericErrorResponse {
    code: number;
    message: string;
    data: AnyType;
}

export interface PocketBaseErrorResponse extends PocketBaseGenericErrorResponse {
    url: string;
    status: number;
    response: Response;
    isAbort: boolean;
    originalError: OriginalError;
    name: string;
}

export interface OriginalError {
    url: string;
    status: number;
    data: Response;
}

export interface Response {
    data: Data;
    message: string;
    status: number;
}

export interface Data {
    url: URL;
}

export interface URL {
    code: string;
    message: string;
}
