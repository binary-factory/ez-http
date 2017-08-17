import { EzRequest } from './request';
import { EzResponse } from './response';

type RequestHandlerResult = boolean | void;

export interface RequestHandlerFunc {
    (request: EzRequest, response: EzResponse): Promise<RequestHandlerResult> | RequestHandlerResult;
}

export interface RequestHandlerHolder {
    handleRequest: RequestHandlerFunc;
}

export type RequestHandler = RequestHandlerFunc | RequestHandlerHolder;