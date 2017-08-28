import { MetadataKey } from '../metadata/metadata-key';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { EzController } from '../controller';

export function controller(prefix: string) {
    return function (target: EzController) {
        const controllerMetadata: ControllerMetadata = {
            target,
            prefix
        };
        Reflect.defineMetadata(MetadataKey.Controller, controllerMetadata, target);
    }
}