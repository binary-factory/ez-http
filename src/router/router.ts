import { HttpMethod } from '../core/http-method';
import { EzMiddleware, EzMiddlewareLike } from '../core/middleware';
import { EzMiddlewareHolder } from '../core/middleware-holder';
import { EzRequest } from '../core/request';
import { EzRoute, EzRoutePath } from './route';

export class EzRouter extends EzMiddlewareHolder {

    private _routes: EzRoute[] = [];

    private _routers: EzRouter[] = [];

    private _invokeNext: (EzRoute | EzRouter)[] = [];

    constructor(private _prefix?: string) {
        super();
    }

    use(...middlewares: EzMiddlewareLike[]) {
        const remainder: EzMiddlewareLike[] = [];
        for (const middleware of middlewares) {
            if (middleware instanceof EzRoute) {
                middleware.parent = this;
                this._routes.push(middleware);

            } else if (middleware instanceof EzRouter) {
                middleware.parent = this;
                this._routers.push(middleware);

            } else {
                remainder.push(middleware);
            }
        }

        super.use(...remainder)
    }

    canActivate(request: EzRequest): boolean {
        this._invokeNext = [];

        for (const route of this._routes) {
            if (route.canActivate(request)) {
                this._invokeNext.push(route);
            }
        }

        for (const router of this._routers) {
            if (router.canActivate(request)) {
                this._invokeNext.push(router);
            }
        }

        return this._invokeNext.length > 0;
    }

    teardown(request: EzRequest) {
        this._invokeNext = [];
    }

    add(path: EzRoutePath, method: HttpMethod | string, ...handler: EzMiddlewareLike[]): EzRoute {
        const route = new EzRoute(path, method);

        route.use(...handler);
        this.use(route);

        return route;
    }

    get(path: EzRoutePath, ...handler: EzMiddlewareLike[]): EzRoute {
        return this.add(path, HttpMethod.Get, ...handler);
    }

    head(path: EzRoutePath, ...handler: EzMiddlewareLike[]): EzRoute {
        return this.add(path, HttpMethod.Head, ...handler);
    }

    post(path: EzRoutePath, ...handler: EzMiddlewareLike[]): EzRoute {
        return this.add(path, HttpMethod.Post, ...handler);
    }

    put(path: EzRoutePath, ...handler: EzMiddlewareLike[]): EzRoute {
        return this.add(path, HttpMethod.Put, ...handler);
    }

    del(path: EzRoutePath, ...handler: EzMiddlewareLike[]): EzRoute {
        return this.add(path, HttpMethod.Delete, ...handler);
    }

    protected compose(request: EzRequest): EzMiddleware[] {
        return [...this._children, ...this._invokeNext];
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value;
    }
}