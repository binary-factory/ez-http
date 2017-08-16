import { EzRequest } from './request';
import { EzResponse } from './response';


export interface RequestHandlerFunc {
    (request: EzRequest, response: EzResponse): Promise<void> | void;
}

export interface RequestHandlerHolder {
    handleRequest: RequestHandlerFunc;
}

export type RequestHandler = RequestHandlerFunc | RequestHandlerHolder;