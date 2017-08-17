import { EzMiddleware, EzMiddlewareLike, MiddlewareAction } from './middleware';
import { EzRequest } from './request';
import { EzResponse } from './response';
import { HttpError } from './http-error';
import { HttpStatusCode } from './http-status-code';

export abstract class EzMiddlewareHolder extends EzMiddleware {

    protected _children: EzMiddleware[] = [];

    // TODO: Cleanup!
    use(middleware: EzMiddlewareLike | EzMiddlewareLike[]) {
        let items: EzMiddlewareLike[] = [];
        if (Array.isArray(middleware)) {
            items.push(...middleware);
        } else {
            items.push(middleware);
        }

        const converted: EzMiddleware[] = [];
        for (const middleware of items) {
            if (typeof middleware === 'function') {
                const wrapper = new class extends EzMiddleware {
                    execute(request: EzRequest, response: EzResponse): MiddlewareAction | Promise<MiddlewareAction> {
                        return middleware(request, response) || MiddlewareAction.Continue;
                    }
                };

                converted.push(wrapper);
            } else {
                converted.push(middleware);
            }
        }

        this._children.push(...converted);
    }

    protected compose(): EzMiddleware[] {
        return this._children;
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

    private wrapError(err: Error, message?: string): HttpError {
        if (err instanceof HttpError) {
            return err;
        } else {
            return new HttpError(HttpStatusCode.InternalServerError, message, err);
        }
    }
}