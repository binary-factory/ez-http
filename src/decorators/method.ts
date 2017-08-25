import { MetadataKey } from '../metadata/metadata-key';
import { ControllerMethodMetadata } from '../metadata/controller-method';
import { EzRoutePath } from '../router/route';

export function method(method: string, path?: EzRoutePath): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const meta: ControllerMethodMetadata = {
            target,
            propertyKey,
            descriptor,
            path,
            method
        };
        let metadataList: ControllerMethodMetadata[] = [];
        if (Reflect.hasOwnMetadata(MetadataKey.ControllerMethod, target.constructor)) {
            metadataList = Reflect.getOwnMetadata(MetadataKey.ControllerMethod, target.constructor);
        } else {
            Reflect.defineMetadata(MetadataKey.ControllerMethod, metadataList, target.constructor);
        }

        metadataList.push(meta);
    }
}