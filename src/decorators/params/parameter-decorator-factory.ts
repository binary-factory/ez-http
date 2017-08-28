import { EzContext } from '../../middleware/context';
import { EzController } from '../../controller';
import { MetadataKey } from '../../metadata/metadata-key';
import { ControllerMethodParameterMetadata } from '../../metadata/controller-method-parameter-metadata';

export function createParameterDecorator(provider: (context: EzContext) => any) {
    return function (target: EzController, propertyKey: string, parameterIndex: number) {
        const controllerMethodParameterMetadata: ControllerMethodParameterMetadata = {
            index: parameterIndex,
            provider
        };

        let methodNameMap: Map<string, ControllerMethodParameterMetadata[]> = new Map();
        if (Reflect.hasOwnMetadata(MetadataKey.ControllerMethodParameters, target.constructor)) {
            methodNameMap = Reflect.getOwnMetadata(MetadataKey.ControllerMethodParameters, target.constructor);
        } else {
            Reflect.defineMetadata(MetadataKey.ControllerMethodParameters, methodNameMap, target.constructor);
        }

        let parameterList: ControllerMethodParameterMetadata[] = [];
        if (methodNameMap.has(propertyKey)) {
            parameterList = methodNameMap.get(propertyKey);
        } else {
            methodNameMap.set(propertyKey, parameterList);
        }

        parameterList.unshift(controllerMethodParameterMetadata);

        console.log(Reflect.getOwnMetadataKeys( target.constructor))
    }
}