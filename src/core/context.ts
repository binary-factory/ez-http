import * as url from 'url';
import { HttpStatusCode } from './http-status-code';
import { EzRequest } from './request';
import { EzResponse } from './response';
import * as http from 'http';

export interface EzContextPlugin {

}

const _plugins: any = [];

export function registerPlugin(factory: any) {
    _plugins.push(factory);
}

export class EzContext {

    private _url: url.Url;

    private _dirty: boolean;

    private _plugins: EzContextPlugin;

    constructor(private _request: http.IncomingMessage, private _response: http.ServerResponse) {
        (<any>this._plugins) = {};
        for (const plugin of _plugins) {
            plugin(this);
        }
    }

    setup() {
        console.log('original setup');
    }

    json(obj: any) {
        this._response.writeHead(HttpStatusCode.OK, {'content-type': 'application/json'});
        this.response.write(JSON.parse(obj));
    }

    get request(): EzRequest {
        return this._request;
    }

    get response(): EzResponse {
        return this._response;
    }

    get plugins(): EzContextPlugin {
        return this._plugins;
    }
}