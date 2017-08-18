import { EzRequest } from './request';
import { EzResponse } from './response';
import { EzMiddlewareHolder } from './middleware-holder';

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

    protected _parent: EzMiddlewareHolder;

    setup(request: EzRequest): void | Promise<void> {
    }

    canActivate(request: EzRequest): boolean | Promise<boolean> {
        return true;
    }

    abstract execute(request: EzRequest, response: EzResponse): EzMiddlewareExecutionResult;

    teardown() {
    }

    get parent(): EzMiddlewareHolder {
        return this._parent;
    }

    set parent(value: EzMiddlewareHolder) {
        this._parent = value;
    }
}