import { RequestHandler } from './request-handler';
import { EzRequest } from './request';
import { EzResponse } from './response';

export abstract class RequestHandlerContainer {
    private _requestHandlers: RequestHandler[] = [];

    use(middleware: RequestHandler | RequestHandler[]) {
        if (Array.isArray(middleware)) {
            this._requestHandlers.push(...middleware);
        } else {
            this._requestHandlers.push(middleware);
        }
    }

    async invokeRequestHandlers(request: EzRequest, response: EzResponse): Promise<void> {
        for (const requestHandler of this._requestHandlers) {
            await this.invokeRequestHandler(requestHandler, request, response);
            // TODO: Break if response was fully sent?
        }
    }

    invokeRequestHandler(requestHandler: RequestHandler, request: EzRequest, response: EzResponse): Promise<void> | void {
        if (typeof requestHandler === 'function') {
            return requestHandler(request, response);
        } else  {
            return requestHandler.handleRequest(request, response);
        }
    }
}