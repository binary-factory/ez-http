import * as http from 'http';
import * as url from 'url';

export interface EzCoreRequest extends http.IncomingMessage {
    parsedUrl?: url.Url;
    params?: any;
}

export interface EzRequest extends EzCoreRequest {
}