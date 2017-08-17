import * as pathToRegexp from 'path-to-regexp';
import { EzRequest, EzResponse, RequestHandler } from '../core';
import { HttpMethod } from '../core/http-method';
import { RequestHandlerContainer } from '../core/request-handler-container';
import { RequestHandlerHolder } from '../core/request-handler';
import { EzRoute } from './route';
import { HttpError } from '../core/http-error';
import { HttpStatusCode } from '../core/http-status-code';

export class EzRouter extends RequestHandlerContainer implements RequestHandlerHolder {

    private _routes: EzRoute[] = [];

    constructor(private _prefix?: string) {
        super();
    }

    async handleRequest(request: EzRequest, response: EzResponse): Promise<boolean> {
        const matchingPath: EzRoute[] = [];
        for (const route of this._routes) {
            if (route.matchPath(request)) {
                matchingPath.push(route);
            }
        }

        const matchingMethod: EzRoute[] = [];
        for (const route of matchingPath) {
            if (route.matchMethod(request)) {
                matchingMethod.push(route)
            }
        }

        if (matchingPath.length > 0) {
            if (matchingMethod.length > 0) {

                // Invoke router specific middleware.
                const exited = await this.invokeRequestHandlers(request, response);
                if (exited) {
                    console.log('a middleware of the router broke the chain.');
                    return;
                }

                for (const route of matchingMethod) {
                    // Invoke route specific middleware.
                    await route.invokeRequestHandlers(request, response);
                }

                // Check whether the route handler send a response.
                // If no response-headers are send we send a No-Content status.
                if (!response.headersSent) {
                    response.writeHead(204);
                    response.end();
                }

            } else {
                throw new HttpError(HttpStatusCode.MethodNotAllowed);
            }
        }
    }

    add(path: pathToRegexp.Path, method: HttpMethod | string, handler: RequestHandler | RequestHandler[]) {
        const route = new EzRoute(path, method);
        route.use(handler);
        this._routes.push(route);
    }

    get(path: pathToRegexp.Path, handler: RequestHandler | RequestHandler[]) {
        this.add(path, HttpMethod.Get, handler);
    }

    head(path: pathToRegexp.Path, handler: RequestHandler | RequestHandler[]) {
        this.add(path, HttpMethod.Head, handler);
    }

    post(path: pathToRegexp.Path, handler: RequestHandler | RequestHandler[]) {
        this.add(path, HttpMethod.Post, handler);
    }

    put(path: pathToRegexp.Path, handler: RequestHandler | RequestHandler[]) {
        this.add(path, HttpMethod.Put, handler);
    }

    del(path: pathToRegexp.Path, handler: RequestHandler | RequestHandler[]) {
        this.add(path, HttpMethod.Delete, handler);
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value;
    }
}