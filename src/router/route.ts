import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from '../core/http-method';
import { EzMiddlewareHolder } from '../core/middleware-holder';
import { EzRouter } from './router';
import { EzContext } from '../core/context';

export type EzRoutePath = string | RegExp;

export class EzRoute extends EzMiddlewareHolder {

    constructor(private _path: EzRoutePath, private _method: HttpMethod | string) {
        super();
    }

    canActivate(context: EzContext): boolean {
        if (this.matchPath(context)) {
            context.plugins.router.dirty = true;
            if (this.matchMethod(context)) {
                context.plugins.router.route = this;
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
            .filter((parent) => {
                return parent instanceof EzRouter;
            })
            .map((router: EzRouter) => {
                return router.prefix;
            })
            .reverse();

        return prefixes.join('') + this._path;
    }

    private matchPath(context: EzContext): boolean {
        const compiled = pathToRegexp(this.fullPath);
        const matches = compiled.exec(context.url.path);
        if (matches) {
            // Fill request params.
            context.plugins.router.params = {};
            for (let i = 1; i < matches.length; i++) {
                const match = matches[i];
                if (match) {
                    const pathKey = compiled.keys[i - 1];
                    context.plugins.router.params[pathKey.name] = match;
                }
            }

            return true;
        }

        return false;
    }

    private matchMethod(context: EzContext): boolean {
        if (this._method == HttpMethod.All) {
            return true;
        }

        return context.request.method.toLowerCase() === this._method.toLowerCase();
    }
}