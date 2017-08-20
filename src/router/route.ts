import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from '../core/http-method';
import { EzMiddlewareHolder } from '../core/middleware-holder';
import { EzRequest } from '../core/request';
import { EzRouter } from './router';

export type EzRoutePath = string | RegExp;

export class EzRoute extends EzMiddlewareHolder {

    constructor(private _path: EzRoutePath, private _method: HttpMethod | string) {
        super();
    }

    canActivate(request: EzRequest): boolean {
        console.log('canActivate: ' + this.fullPath);
        if (this.matchPath(request)) {
            request.dirty = true;
            if (this.matchMethod(request)) {
                request.route = this;
                return true;
            }
        }

        return false;
    }

    get path(): EzRoutePath {
        return this._path;
    }

    set path(value: EzRoutePath) {
        this._path = value;
    }

    get method(): HttpMethod | string {
        return this._method;
    }

    set method(value: HttpMethod | string) {
        this._method = value;
    }

    get fullPath(): EzRoutePath {
        const prefixes = this.parents
            .filter((holder) => {
                return holder instanceof EzRouter;
            })
            .map((router: EzRouter) => {
                return router.prefix;
            })
            .reverse();

        return prefixes.join('') + this._path;
    }

    private matchPath(request: EzRequest): boolean {
        const compiled = pathToRegexp(this.fullPath);
        const matches = compiled.exec(request.parsedUrl.path);
        if (matches) {
            // Fill request params.
            request.params = {};
            for (let i = 1; i < matches.length; i++) {
                const match = matches[i];
                if (match) {
                    const pathKey = compiled.keys[i - 1];
                    request.params[pathKey.name] = match;
                }
            }

            return true;
        }

        return false;
    }

    private matchMethod(request: EzRequest): boolean {
        if (this._method == HttpMethod.All) {
            return true;
        }

        return request.method.toLowerCase() === this._method.toLowerCase();
    }
}