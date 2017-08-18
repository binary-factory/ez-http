import { EzMiddlewareHolder } from '../core/middleware-holder';
import { EzMiddleware, EzMiddlewareLike } from '../core/middleware';
import { EzRoute } from './route';
import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from '../core/http-method';

export class EzRouter extends EzMiddlewareHolder {

    private _routes: EzRoute[] = [];

    constructor(private _prefix?: string) {
        super();
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
        return this._routes;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value;
    }

    get rootRouter(): EzRouter {
        let router: EzRouter = this;
        while (router.parent instanceof EzRouter) {
            router = router.parent;
        }

        return router;
    }

    get fullPrefix(): string {
        let prefixes: string[] = [this._prefix];
        let router: EzRouter = this;
        while (router.parent instanceof EzRouter) {
            router = router.parent;
            if (router.prefix) {
                prefixes.push(router.prefix);
            }
        }

        return prefixes.reverse().join('/');
    }
}