import * as url from 'url';
import { HttpStatusCode } from '../http/http-status-code';
import * as http from 'http';

export class EzContext {

    private _url: url.Url;

    constructor(private _request: http.IncomingMessage, private _response: http.ServerResponse) {
        this._url = url.parse(this._request.url);
    }

    json(obj: any) {
        this._response.writeHead(HttpStatusCode.OK, {'content-type': 'application/json'});
        this.response.write(JSON.stringify(obj));
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

}