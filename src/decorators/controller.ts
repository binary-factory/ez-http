import { MetadataKey } from '../metadata/metadata-key';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { injectable } from 'inversify';

export function controller(prefix: string): any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const meta: ControllerMetadata = {
            target,
            propertyKey,
            descriptor,
            prefix
        };
        Reflect.defineMetadata(MetadataKey.Controller, meta, target);

        // Also register as injectable.
        injectable()(target);
    }
}