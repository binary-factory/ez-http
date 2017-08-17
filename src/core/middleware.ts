import { EzRequest } from './request';
import { EzResponse } from './response';

export enum MiddlewareAction {
    Continue,
    SkipHolder,
    SkipAll
}

export type EzMiddlewareExecutionResult = MiddlewareAction | Promise<MiddlewareAction>;

export type EzMiddlewareLike = EzMiddleware | EzMiddlewareFunc

export interface EzMiddlewareFunc {
    (request: EzRequest, response: EzResponse): EzMiddlewareExecutionResult | void;
}

export abstract class EzMiddleware {

    setup(request: EzRequest): void | Promise<void> {

    }

    canActivate(request: EzRequest): boolean | Promise<boolean> {
        return true;
    }

    abstract execute(request: EzRequest, response: EzResponse): EzMiddlewareExecutionResult;

    teardown() {

    }
}