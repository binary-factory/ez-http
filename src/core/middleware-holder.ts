import { EzMiddleware, EzMiddlewareLike, MiddlewareAction } from './middleware';
import { EzRequest } from './request';
import { EzResponse } from './response';

export abstract class EzMiddlewareHolder extends EzMiddleware {

    protected _children: EzMiddleware[] = [];

    use(...middlewares: EzMiddlewareLike[]) {
        const holders: EzMiddleware[] = [];
        for (const middleware of middlewares) {
            if (typeof middleware === 'function') {
                // Wrap function within anonymous instance of Middleware.
                const holder = new class extends EzMiddleware {
                    execute(request: EzRequest, response: EzResponse): MiddlewareAction | Promise<MiddlewareAction> {
                        return middleware(request, response) || MiddlewareAction.Continue;
                    }
                };

                holders.push(holder);
            } else {
                holders.push(middleware);
            }
        }

        // Set parent for all.
        for (const holder of holders) {
            holder.parent = this;
        }

        this._children.push(...holders);
    }

    async execute(request: EzRequest, response: EzResponse): Promise<MiddlewareAction> {
        return this.executeMultiple(request, response, this.compose(request));
    }

    async executeMultiple(request: EzRequest, response: EzResponse, children: EzMiddleware[]): Promise<MiddlewareAction> {
        let action: MiddlewareAction = MiddlewareAction.Continue;

        for (const child of children) {

            await child.setup(request);

            if (child.canActivate(request)) {

                action = await child.execute(request, response);
                if (action !== MiddlewareAction.Continue) {
                    return this.gradateAction(action);
                }

            }

            await child.teardown(request);
        }

        return MiddlewareAction.Continue;
    }

    protected compose(request: EzRequest): EzMiddleware[] {
        return this._children;
    }

    private gradateAction(action: MiddlewareAction): MiddlewareAction {
        if (MiddlewareAction.Continue) {
            return MiddlewareAction.Continue;
        } else if (action === MiddlewareAction.SkipHolder) {
            return MiddlewareAction.Continue;
        } else if (action === MiddlewareAction.SkipAll) {
            return MiddlewareAction.SkipAll;
        }
    }

    get children(): EzMiddleware[] {
        return this._children;
    }

    set children(value: EzMiddleware[]) {
        this._children = value;
    }
}