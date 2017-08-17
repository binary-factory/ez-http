import * as http from 'http';
import * as url from 'url';
import { EzMiddlewareHolder, EzRequest, EzResponse, HttpError, HttpStatusCode } from './core';

export class EzServer extends EzMiddlewareHolder {
    private _server: http.Server;

    constructor() {
        super();
        this._server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
            this.handleRequest(request, response)
                .catch((err) => {
                    try {
                        if (!(err instanceof HttpError)) {
                            err = new HttpError(HttpStatusCode.InternalServerError, 'unknown error', err);
                        }

                        if (!response.headersSent) {
                            response.writeHead(err.statusCode);
                        }

                        if (!response.finished) {
                            if (process.env.DEBUG) {
                                response.end(err.message);
                            } else {
                                response.end();
                            }
                        }

                        if (process.env.DEBUG) {
                            console.log('Sending HTTP-Error: ', err.message);
                            console.log('Related: ', err.relatedError);
                        }
                    } catch (ex) {
                        console.log('error during closing faulty request.');
                    }
                });
        });
    }

    listen(port: number) {
        this._server.listen(port);
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
}