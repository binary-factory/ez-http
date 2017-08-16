import { HttpMethod, RequestHandler } from "../core";
import * as pathToRegexp from 'path-to-regexp';
import { EzRequest } from '../core/request';
import { MiddlewareHolder } from '../core/middleware-holder';


export class EzRoute extends MiddlewareHolder {

    private _path: pathToRegexp.PathRegExp;

    constructor(path: pathToRegexp.Path, method: HttpMethod | string, private _handler: RequestHandler) {
        super();
        this._path = pathToRegexp(path);
    }

    match(request: EzRequest): boolean {
        const matches = this._path.exec(request.parsedUrl.path);
        if (matches) {
            // Fill request params.
            request.params = {};
            for (let i = 1; i < matches.length; i++) {
                const match = matches[i];
                if (match) {
                    const pathKey = this._path.keys[i - 1];
                    request.params[pathKey.name] = match;
                }
            }

            return true;
        }

        return false;
    }


    get path(): pathToRegexp.PathRegExp {
        return this._path;
    }

    set path(value: pathToRegexp.PathRegExp) {
        this._path = value;
    }

    get handler(): RequestHandler {
        return this._handler;
    }

    set handler(value: RequestHandler) {
        this._handler = value;
    }
}