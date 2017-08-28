import { method } from './method';
import { HttpMethod } from '../http/http-method';
import { EzRoutePath } from '../router/route';
import { EzController } from '../controller';
import { EzMiddlewareInject } from '../middleware/middleware';

export function get(path?: EzRoutePath) {
    return function (target: EzController, propertyKey: string, descriptor: TypedPropertyDescriptor<EzMiddlewareInject>) {
        return method(HttpMethod.Get, path)(target, propertyKey, descriptor);
    }
}