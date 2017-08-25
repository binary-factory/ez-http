import * as http from 'http';
import { HttpError, HttpStatusCode } from './http';
import { EzContext } from './middleware/context';
import { EzMiddlewareHolder } from './middleware/middleware-holder';
import { EzPluginManager } from './plugins/plugin-manager';
import { Container } from 'inversify';
import { Controller } from './inversify/controller';
import { Type } from './inversify/type';
import { MetadataKey } from './metadata/metadata-key';
import { ControllerMetadata } from './metadata/controller-metadata';
import { EzRouter } from './router/router';
import { ControllerMethodMetadata } from './metadata/controller-method-metadata';

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

    registerContainer(container: Container) {
        let controllers: Controller[] = container.getAll<Controller>(Type.Controller);
        for (const controller of controllers) {
            const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(MetadataKey.Controller, controller.constructor);
            if (!controllerMetadata) {
                console.warn('class was not decorated as controller.');
                continue;
            }
            const router = new EzRouter(controllerMetadata.prefix);
            this.use(router);

            const controllerMethodMetadata: ControllerMethodMetadata[] = Reflect.getOwnMetadata(MetadataKey.ControllerMethod, controller.constructor);
            for (const methodMetadata of controllerMethodMetadata) {
                router.add(methodMetadata.path, methodMetadata.method,methodMetadata.target[methodMetadata.propertyKey]);
            }
        }
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