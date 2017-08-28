import { createParameterDecorator } from './parameter-decorator-factory';
import { EzContext } from '../../middleware/context';
import { EzController } from '../../controller';

export function param(propertyKey: string) {
    return createParameterDecorator(function (context: EzContext) {
        return context.params[propertyKey];
    });
}