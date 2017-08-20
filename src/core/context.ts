import * as url from 'url';
import { HttpStatusCode } from './http-status-code';
import * as http from 'http';
import { EzPluginManager } from '../plugins/manager';
import { EzContextPlugins } from '../plugins/context';

export class EzContext {

    private _url: url.Url;

    private _plugins: EzContextPlugins;

    constructor(private _request: http.IncomingMessage, private _response: http.ServerResponse) {
    }

    async setup() {
        this._url = url.parse(this._request.url);

        // Setup the plugins.
        const setups =  EzPluginManager.plugins.map((plugin) => plugin.setupContext);
        await Promise.all(setups);
    }

    json(obj: any) {
        this._response.writeHead(HttpStatusCode.OK, {'content-type': 'application/json'});
        this.response.write(JSON.parse(obj));
    }

    get request(): http.IncomingMessage {
        return this._request;
    }

    get response(): http.ServerResponse {
        return this._response;
    }

    get url(): url.Url {
        return this._url;
    }

    get plugins(): EzContextPlugins {
        return this._plugins;
    }
}