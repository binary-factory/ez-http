import { EzRequest } from '../core/request';
import { HttpMethod } from '../core/http-method';
import * as pathToRegexp from 'path-to-regexp';
import { EzMiddlewareHolder } from '../core/middleware-holder';

export class EzRoute extends EzMiddlewareHolder {

    constructor(private _path: pathToRegexp.Path, private _method: HttpMethod | string) {
        super();
        this._pathRegExp = pathToRegexp(this._path);
    }

    private _pathRegExp: pathToRegexp.PathRegExp;

    get pathRegExp(): pathToRegexp.PathRegExp {
        return this._pathRegExp;
    }

    set pathRegExp(value: pathToRegexp.PathRegExp) {
        this._pathRegExp = value;
    }

    get path(): pathToRegexp.Path {
        return this._path;
    }

    set path(value: pathToRegexp.Path) {
        this._path = value;
    }

    get method(): HttpMethod | string {
        return this._method;
    }

    set method(value: HttpMethod | string) {
        this._method = value;
    }

    matchPath(request: EzRequest): boolean {
        const matches = this._pathRegExp.exec(request.parsedUrl.path);
        if (matches) {
            // Fill request params.
            request.params = {};
            for (let i = 1; i < matches.length; i++) {
                const match = matches[i];
                if (match) {
                    const pathKey = this._pathRegExp.keys[i - 1];
                    request.params[pathKey.name] = match;
                }
            }

            return true;
        }

        return false;
    }

    matchMethod(request: EzRequest): boolean {
        if (this._method == HttpMethod.All) {
            return true;
        }

        return request.method.toLowerCase() === this._method.toLowerCase();
    }
}