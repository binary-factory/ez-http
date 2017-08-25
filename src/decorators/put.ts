import { method } from './method';
import { HttpMethod } from '../http/http-method';
import { EzRoutePath } from '../router/route';
import { EzMiddlewareLike } from '../middleware/middleware';

export function put(path?: EzRoutePath): any {
    return function (target: EzMiddlewareLike, propertyKey: string, descriptor: PropertyDescriptor) {
        return method(HttpMethod.Put, path)(target, propertyKey, descriptor);
    }
}