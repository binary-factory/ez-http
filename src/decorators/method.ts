import { MetadataKey } from '../metadata/metadata-key';
import { ControllerMethodMetadata } from '../metadata/controller-method-metadata';
import { EzRoutePath } from '../router/route';
import { EzMiddlewareInject } from '../middleware/middleware';
import { EzController } from '../controller';

export function method(method: string, path?: EzRoutePath) {
    return function (target: EzController, propertyKey: string, descriptor: TypedPropertyDescriptor<EzMiddlewareInject>) {
        const controllerMethodMetadata: ControllerMethodMetadata = {
            target,
            propertyKey,
            path,
            method
        };

        let metadataList: ControllerMethodMetadata[] = [];
        if (Reflect.hasOwnMetadata(MetadataKey.ControllerMethods, target.constructor)) {
            metadataList = Reflect.getOwnMetadata(MetadataKey.ControllerMethods, target.constructor);
        } else {
            Reflect.defineMetadata(MetadataKey.ControllerMethods, metadataList, target.constructor);
        }

        metadataList.push(controllerMethodMetadata);
    }
}