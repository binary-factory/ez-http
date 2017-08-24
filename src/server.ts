import * as http from 'http';
import { HttpError, HttpStatusCode } from './http';
import { EzContext } from './middleware/context';
import { EzMiddlewareHolder } from './middleware/middleware-holder';
import { EzPluginManager } from './plugins/plugin-manager';

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

    register() {

    }

    listen(port: number) {
        this._server.listen(port, () => {
            // TODO: Resolve Promise.
        });
    }

    private async handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        const context = new EzContext(request, response);

        for (const plugin of EzPluginManager.plugins) {
            await plugin.prepare(context);
        }

        await this.execute(context);

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