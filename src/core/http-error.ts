import { HttpStatusCode } from './http-status-code';

export class HttpError extends Error {
    constructor(private _statusCode: HttpStatusCode, message?: string, private _relatedError?: Error) {
        super(message);
        this.name = HttpStatusCode[_statusCode];
    }
}