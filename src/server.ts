import * as http from 'http';
import { EzMiddlewareHolder, EzRequest, EzResponse, HttpError, HttpStatusCode } from './core';
import { EzContext } from './core/context';
import { EzPluginManager } from './plugins/manager';

export class EzServer extends EzMiddlewareHolder {
    private _server: http.Server;

    constructor() {
        super();
        this._server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
            this.handleRequest(request, response)
                .catch((err) => {
                    this.handleError(request, response, err);
                });
        });
    }

    listen(port: number) {
        this._server.listen(port);
    }

    private async handleRequest(request: EzRequest, response: EzResponse) {
        const context = new EzContext(request, response);
        await context.setup();

        for (const plugin of EzPluginManager.plugins) {
            await plugin.prepare(context);
        }

        await this.execute(request, response);

        for (const plugin of EzPluginManager.plugins) {
            await plugin.finish(context);
        }

        if (!response.headersSent) {
            response.writeHead(HttpStatusCode.NotImplemented);
        }

        if (!response.finished) {
            response.end();
        }
    }

    private handleError(request: http.IncomingMessage, response: http.ServerResponse, err: any) {
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
    }
}