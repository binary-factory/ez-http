import { EzMiddlewareHolder } from './middleware-holder';
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

    protected _parent: EzMiddlewareHolder;

    abstract execute(request: EzRequest, response: EzResponse): EzMiddlewareExecutionResult;

    setup(request: EzRequest): void | Promise<void> {
    }

    canActivate(request: EzRequest): boolean | Promise<boolean> {
        return true;
    }

    teardown(request: EzRequest) {
    }

    get parent(): EzMiddlewareHolder {
        return this._parent;
    }

    set parent(value: EzMiddlewareHolder) {
        this._parent = value;
    }

    get parents(): EzMiddlewareHolder[] {
        const holders: EzMiddlewareHolder[] = [];
        let currentHolder: EzMiddlewareHolder = this.parent;
        while (currentHolder) {
            holders.push(currentHolder);

            currentHolder = currentHolder.parent;
        }

        return holders;
    }
}