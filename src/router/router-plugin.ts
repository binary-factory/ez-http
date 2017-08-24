import { EzPlugin } from '../plugins/plugin';
import { EzContext } from '../middleware/context';
import { RouterContext } from './router-context';
import { HttpStatusCode } from '../http/http-status-code';

export class EzRouterPlugin extends EzPlugin {

    activate(): void | Promise<void> {
    }

    prepare(context: EzContext): void | Promise<void> {
        context.router = new RouterContext();
    }

    finish(context: EzContext): void | Promise<void> {
        const response = context.response;
        if (!response.headersSent) {
            if (context.router.dirty.length > 0) {
                if (context.router.route) {
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