import * as http from 'http';
import * as url from 'url';
import { EzMiddlewareHolder } from './core/middleware-holder';
import { HttpError } from './core/http-error';
import { HttpStatusCode } from './core/http-status-code';
import { EzRequest } from './core/request';
import { EzResponse } from './core/response';

export class EzServer2 extends EzMiddlewareHolder {
    private _server: http.Server;

    constructor() {
        super();
        this._server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
            this.handleRequest(request, response)
                .catch((err) => {
                    if (!response.headersSent) {
                        response.writeHead(500);
                    }

                    if (!response.finished) {
                        response.end();
                    }
                });
        });
    }

    private async handleRequest(request: EzRequest, response: EzResponse) {
        // Parse URL.
        try {
            request.parsedUrl = url.parse(request.url, true);
        } catch (ex) {
            throw new HttpError(HttpStatusCode.BadRequest, 'url malformed.', ex);
        }

        // Call all the middlewares in order.
        await this.execute(request, response);

        if (!response.headersSent) {
            response.writeHead(404);
        }

        if (!response.finished) {
            response.end();
        }
    }

    listen(port: number) {
        this._server.listen(port);
    }
}