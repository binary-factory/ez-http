import * as http from 'http';
import { HttpError, HttpStatusCode } from './http';
import { EzContext } from './middleware/context';
import { EzMiddlewareHolder } from './middleware/middleware-holder';
import { EzPluginManager } from './plugins/plugin-manager';
import { EzController } from './controller';
import { MetadataKey } from './metadata/metadata-key';
import { ControllerMetadata } from './metadata/controller-metadata';
import { EzRouter } from './router/router';
import { ControllerMethodMetadata } from './metadata/controller-method-metadata';
import { EzServerConfiguration } from './server-configuration';
import { ControllerMethodParameterMetadata } from './metadata/controller-method-parameter-metadata';


export class EzServer extends EzMiddlewareHolder {
    private _server: http.Server;

    constructor(options?: EzServerConfiguration) {
        super();
        this._server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
            this.handleRequest(request, response)
                .catch((err) => {
                    this.handleError(request, response, err);
                });
        });
    }

    registerControllers(controllers: EzController[]) {
        for (const controller of controllers) {
            const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(MetadataKey.Controller, controller.constructor);
            if (!controllerMetadata) {
                console.warn('class was not decorated as controller.');
                continue;
            }

            // Each controller will be a EzRouter instance.
            const router = new EzRouter(controllerMetadata.prefix);
            this.use(router);

            const controllerMethodMetadata: ControllerMethodMetadata[] = Reflect.getOwnMetadata(MetadataKey.ControllerMethods, controller.constructor);
            for (const methodMetadata of controllerMethodMetadata) {
                const requestHandler = methodMetadata.target[methodMetadata.propertyKey];
                const requestHandlerName = methodMetadata.propertyKey;

                // Insert injection layer.
                const injectionLayer = async (context: EzContext) => {
                    const args: any[] = [];
                    const paramMap: Map<string, ControllerMethodParameterMetadata[]> = Reflect.getOwnMetadata(MetadataKey.ControllerMethodParameters, controller.constructor);
                    if (paramMap && paramMap.has(requestHandlerName)) {
                        const params: ControllerMethodParameterMetadata[] = paramMap.get(requestHandlerName);

                        try {
                            params.forEach((paramMetadata) => {
                                args.push(paramMetadata.provider(context));
                            });
                        } catch (ex) {
                            console.log('error during resolve injection keys:', ex);
                        }
                    } else {
                        console.log(`handler '${requestHandlerName}' has no injections.`);
                    }

                    return await requestHandler.apply(controller, args);
                };

                // Each route handler will be a EzRoute inside the EzRouter(Controller).
                const route = router.add(methodMetadata.path, methodMetadata.method, injectionLayer);
            }
        }
    }

    listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this._server.listen(port, () => {
                resolve();
            });
        });
    }

    private async handleRequest(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
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