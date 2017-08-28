import { method } from './method';
import { HttpMethod } from '../http/http-method';
import { EzRoutePath } from '../router/route';
import { EzMiddlewareInject } from '../middleware/middleware';
import { EzController } from '../controller';

export function put(path?: EzRoutePath) {
    return function (target: EzController, propertyKey: string, descriptor: TypedPropertyDescriptor<EzMiddlewareInject>) {
        return method(HttpMethod.Put, path)(target, propertyKey, descriptor);
    }
}