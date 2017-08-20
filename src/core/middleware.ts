import { EzMiddlewareHolder } from './middleware-holder';
import { EzContext } from './context';

export enum MiddlewareAction {
    Continue,
    SkipHolder,
    SkipAll
}

export type EzMiddlewareExecutionResult = MiddlewareAction | Promise<MiddlewareAction>;

export type EzMiddlewareLike = EzMiddleware | EzMiddlewareFunc

export interface EzMiddlewareFunc {
    (context: EzContext): EzMiddlewareExecutionResult | void;
}


export abstract class EzMiddleware {

    protected _parent: EzMiddlewareHolder;

    abstract execute(context: EzContext): EzMiddlewareExecutionResult;

    setup(context: EzContext): void | Promise<void> {
    }

    canActivate(context: EzContext): boolean | Promise<boolean> {
        return true;
    }

    teardown(context: EzContext) {
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