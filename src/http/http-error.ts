import { HttpStatusCode } from './http-status-code';

export class HttpError extends Error {
    constructor(private _statusCode: HttpStatusCode, message?: string, private _relatedError?: Error) {
        super(message);
        this.name = HttpStatusCode[_statusCode];
    }

    get statusCode(): HttpStatusCode {
        return this._statusCode;
    }

    set statusCode(value: HttpStatusCode) {
        this._statusCode = value;
    }

    get relatedError(): Error {
        return this._relatedError;
    }

    set relatedError(value: Error) {
        this._relatedError = value;
    }
}