import { EzPlugin } from '../plugins/plugin';
import { EzContext } from '../core/context';
import { RouterContext } from './context';
import { HttpStatusCode } from '../core/http-status-code';

export class EzRouterPlugin extends EzPlugin {

    constructor() {
        super('ez-router');
    }

    activate(): void | Promise<void> {
    }

    setupContext(context: EzContext): void | Promise<void> {
        context.plugins.router = new RouterContext();
    }

    prepare(context: EzContext): void | Promise<void> {
    }

    finish(context: EzContext): void | Promise<void> {
        const response = context.response;
        if (response.headersSent) {
            if (context.plugins.router.dirty) {
                if (context.plugins.router.route) {
                    response.writeHead(HttpStatusCode.NoContent);
                } else {
                    response.writeHead(HttpStatusCode.MethodNotAllowed);
                }
            } else {
                response.writeHead(HttpStatusCode.NotFound);
            }
        }

        if (!response.finished) {
            response.end();
        }
    }
}