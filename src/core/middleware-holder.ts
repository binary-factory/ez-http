import { RequestHandler } from './request-handler';
import { EzRequest } from './request';
import { EzResponse } from './response';

export abstract class MiddlewareHolder {
    private _middlewares: RequestHandler[] = [];

    use(middleware: RequestHandler) {
        this._middlewares.push(middleware);
    }

    async invokeMiddlewares(request: EzRequest, response: EzResponse): Promise<void> {
        for (const middleware of this._middlewares) {
            await this.invokeRequestHandler(middleware, request, response);
            // TODO: Cancel if response if finished?
        }
    }

    invokeRequestHandler(handler: RequestHandler, request: EzRequest, response: EzResponse): Promise<void> | void {
        if (typeof handler === 'function') {
            return handler(request, response);
        } else  {
            return handler.handleRequest(request, response);
        }
    }
}