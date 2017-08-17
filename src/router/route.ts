import * as pathToRegexp from 'path-to-regexp';
import { HttpMethod } from "../core";
import { RequestHandlerContainer } from '../core/request-handler-container';
import { EzRequest } from '../core/request';


export class EzRoute extends RequestHandlerContainer {

    private _pathRegExp: pathToRegexp.PathRegExp;

    constructor(private _path: pathToRegexp.Path, private _method: HttpMethod | string) {
        super();
        this._pathRegExp = pathToRegexp(this._path);
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

    get path(): pathToRegexp.Path {
        return this._path;
    }

    set path(value: pathToRegexp.Path) {
        this._path = value;
    }

    get pathRegExp(): pathToRegexp.PathRegExp {
        return this._pathRegExp;
    }

    set pathRegExp(value: pathToRegexp.PathRegExp) {
        this._pathRegExp = value;
    }

    get method(): HttpMethod | string {
        return this._method;
    }

    set method(value: HttpMethod | string) {
        this._method = value;
    }
}