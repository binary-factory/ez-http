import { EzMiddlewareHolder } from '../core/middleware-holder';
import { EzRequest } from '../core/request';
import { EzMiddleware, EzMiddlewareLike } from '../core/middleware';
import { EzRoute } from './route';
import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from '../core/http-method';
import { HttpError } from '../core/http-error';
import { HttpStatusCode } from '../core/http-status-code';

export class EzRouter extends EzMiddlewareHolder {

    private _routes: EzRoute[] = [];

    private _matchedByPath: EzRoute[];

    private _matchedByMethod: EzRoute[] = [];


    setup(request: EzRequest): void | Promise<void> {
        this._matchedByPath = [];
        for (const route of this._routes) {
            if (route.matchPath(request)) {
                this._matchedByPath.push(route);
            }
        }

        this._matchedByMethod = [];
        for (const route of this._matchedByPath) {
            if (route.matchMethod(request)) {
                this._matchedByMethod.push(route)
            }
        }
    }

    canActivate(request: EzRequest): boolean | Promise<boolean> {
        return this._matchedByMethod.length > 0;
    }

    teardown() {
        let err: HttpError;
        if (this._matchedByPath.length > 0) {
            if (this._matchedByMethod.length > 0) {

            } else {
                err = new HttpError(HttpStatusCode.MethodNotAllowed, 'path matched but invalid method');
            }
        }

        this._matchedByMethod = null;
        this._matchedByPath = null;

        if (err) {
            throw err;
        }
    }

    add(path: pathToRegexp.Path, method: HttpMethod | string, ...handler: EzMiddlewareLike[]) {
        const route = new EzRoute(path, method);
        route.use(...handler);
        this._routes.push(route);
    }

    get (path: pathToRegexp.Path, handler: EzMiddlewareLike[]) {
        this.add(path, HttpMethod.Get, ...handler);
    }

    head(path: pathToRegexp.Path, handler: EzMiddlewareLike[]) {
        this.add(path, HttpMethod.Head, ...handler);
    }

    post(path: pathToRegexp.Path, handler: EzMiddlewareLike[]) {
        this.add(path, HttpMethod.Post, ...handler);
    }

    put(path: pathToRegexp.Path, handler: EzMiddlewareLike[]) {
        this.add(path, HttpMethod.Put, ...handler);
    }

    del(path: pathToRegexp.Path, handler: EzMiddlewareLike[]) {
        this.add(path, HttpMethod.Delete, ...handler);
    }

    protected compose(): EzMiddleware[] {
        return this._children.concat(...this._matchedByMethod);
    }

}