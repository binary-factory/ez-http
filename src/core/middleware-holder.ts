import { EzMiddleware, EzMiddlewareLike, MiddlewareAction } from './middleware';
import { EzRequest } from './request';
import { EzResponse } from './response';
import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

export abstract class EzMiddlewareHolder extends EzMiddleware {

    private _children: EzMiddleware[] = [];

    use(...middlewares: EzMiddlewareLike[]) {
        const holders: EzMiddleware[] = [];
        for (const middleware of middlewares) {
            if (typeof middleware === 'function') {
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

        // Set parents.
        for (const holder of holders) {
            holder.parent = this;
        }

        this._children.push(...holders);
    }

    async execute(request: EzRequest, response: EzResponse): Promise<MiddlewareAction> {
        for (const child of this.compose()) {

            try {
                await child.setup(request);
            } catch (ex) {
                throw this.wrapError(ex, 'middleware setup failed');
            }

            if (child.canActivate(request)) {
                try {
                    const action = await child.execute(request, response);
                    if (MiddlewareAction.Continue) {
                        // Do nothing :).
                    } else if (action === MiddlewareAction.SkipHolder) {
                        console.log('middleware skips this holder.');
                        return MiddlewareAction.Continue;
                    } else if (action === MiddlewareAction.SkipAll) {
                        console.log('middleware skips all.');
                        return MiddlewareAction.SkipAll;
                    }
                } catch (ex) {
                    throw this.wrapError(ex, 'middleware execution failed');
                }
            }

            try {
                await child.teardown();
            } catch (ex) {
                throw this.wrapError(ex, 'middleware teardown failed');
            }
        }

        return MiddlewareAction.Continue;
    }

    protected compose(): EzMiddleware[] {
        return this._children;
    }

    private wrapError(err: Error, message?: string): HttpError {
        if (err instanceof HttpError) {
            return err;
        } else {
            return new HttpError(HttpStatusCode.InternalServerError, message, err);
        }
    }

    get children(): EzMiddleware[] {
        return this._children;
    }

    set children(value: EzMiddleware[]) {
        this._children = value;
    }
}