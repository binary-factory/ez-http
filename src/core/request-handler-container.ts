import { RequestHandler } from './request-handler';
import { EzRequest } from './request';
import { EzResponse } from './response';

export abstract class RequestHandlerContainer {
    private _requestHandlers: RequestHandler[] = [];

    constructor() {

    }

    use(middleware: RequestHandler | RequestHandler[]) {
        if (Array.isArray(middleware)) {
            this._requestHandlers.push(...middleware);
        } else {
            this._requestHandlers.push(middleware);
        }
    }

    async invokeRequestHandlers(request: EzRequest, response: EzResponse): Promise<boolean> {
        for (const requestHandler of this._requestHandlers) {
            const exit = await this.invokeRequestHandler(requestHandler, request, response);
            if (exit) {
                return true;
            }
            // TODO: Break if response was fully sent?
        }

        return false;
    }

    invokeRequestHandler(requestHandler: RequestHandler, request: EzRequest, response: EzResponse) {
        if (typeof requestHandler === 'function') {
            return requestHandler(request, response);
        } else  {
            return requestHandler.handleRequest(request, response);
        }
    }
}