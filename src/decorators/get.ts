import { method } from './method';
import { HttpMethod } from '../http/http-method';
import { EzRoutePath } from '../router/route';

export function get (path?: EzRoutePath): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return method(HttpMethod.Get, path)(target, propertyKey, descriptor);
    }
}