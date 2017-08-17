import * as http from 'http';
import * as url from 'url';
import { EzRoute } from '../router/route';
import { EzRouter } from '../router/router';

export interface EzCoreRequest extends http.IncomingMessage {
    parsedUrl?: url.Url;
    params?: any;
    router?: EzRouter;
    route?: EzRoute;
}

export interface EzRequest extends EzCoreRequest {
}