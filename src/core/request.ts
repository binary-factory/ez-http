import * as http from 'http';
import * as url from 'url';
import { EzRoute } from '../router/route';

export interface EzCoreRequest extends http.IncomingMessage {
    parsedUrl?: url.Url;
    params?: any;
    route?: EzRoute;
    dirty?: boolean;
}

export interface EzRequest extends EzCoreRequest {
}