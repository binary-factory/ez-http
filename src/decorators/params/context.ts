import { createParameterDecorator } from './parameter-decorator-factory';
import { EzContext } from '../../middleware/context';
import { EzController } from '../../controller';

export function context() {
    return createParameterDecorator(function (context: EzContext) {
        return context;
    });
}