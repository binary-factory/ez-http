import { EzPlugin } from '../plugins/plugin';
import { EzContext } from '../core/context';
import { RouterContext } from './context';
import { HttpStatusCode } from '../core/http-status-code';

export class RouterPlugin extends EzPlugin {

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
        if (!context.response.headersSent) {
            if (context.plugins.router.dirty) {
                if (context.plugins.router.route) {
                    context.response.writeHead(HttpStatusCode.NoContent);
                } else {
                    context.response.writeHead(HttpStatusCode.MethodNotAllowed);
                }
            } else {
                context.response.writeHead(HttpStatusCode.NotFound);
            }
        }

        if (!context.response.finished) {
            context.response.end();
        }
    }
}