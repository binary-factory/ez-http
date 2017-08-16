import { RequestHandlerHolder } from '../core/request-handler';
import { EzRequest, EzResponse, RequestHandler } from '../core';
import { EzRoute } from './route';
import { MiddlewareHolder } from '../core/middleware-holder';
import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from '../core/http-method';

export class EzRouter extends MiddlewareHolder implements RequestHandlerHolder {

    private _routes: EzRoute[] = [];

    async handleRequest(request: EzRequest, response: EzResponse): Promise<void> {
        for (const route of this._routes) {
            if (route.match(request)) {
                // Invoke router specific middleware.
                await this.invokeMiddlewares(request, response);

                // Invoke route specific middleware.
                await route.invokeMiddlewares(request, response);

                // Invoke route handler.
                await this.invokeRequestHandler(route.handler, request, response);

                // Check whether the route handler send a response.
                // If no response-headers are send we send a No-Content status.
                if (!response.headersSent) {
                    response.writeHead(204);
                    response.end();
                }
            }
        }
    }

    add(path: pathToRegexp.Path, method: HttpMethod | string, handler: RequestHandler) {
        const route = new EzRoute(path, method, handler);
        this._routes.push(route);
    }

    get(path: pathToRegexp.Path, handler: RequestHandler) {
        this.add(path, HttpMethod.GET, handler);
    }

    head(path: pathToRegexp.Path, handler: RequestHandler) {
        this.add(path, HttpMethod.Head, handler);
    }

    post(path: pathToRegexp.Path, handler: RequestHandler) {
        this.add(path, HttpMethod.Post, handler);
    }

    put(path: pathToRegexp.Path, handler: RequestHandler) {
        this.add(path, HttpMethod.Put, handler);
    }

    del(path: pathToRegexp.Path, handler: RequestHandler) {
        this.add(path, HttpMethod.Delete, handler);
    }
}