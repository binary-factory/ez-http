import { MiddlewareHolder } from './core/middleware-holder';
import * as http from 'http';
import * as url from 'url';

export class EzServer extends MiddlewareHolder {
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

    private async handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        // Parse URL.
        try {
            (<any>request).parsedUrl = url.parse(request.url);
        } catch (ex) {
            //throw new HttpError(HttpErrorCodeClient.BadRequest, 'url malformed.');
            throw ex;
        }

        // Call all the middlewares in order.
        try {
            await this.invokeMiddlewares(request, response);
        } catch(ex) {
            console.log('error handling middleware', ex);
            throw ex;
        }

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