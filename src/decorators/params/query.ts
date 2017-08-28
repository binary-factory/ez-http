import { createParameterDecorator } from './parameter-decorator-factory';
import { EzContext } from '../../middleware/context';
import { EzController } from '../../controller';
import * as querystring from 'querystring';

export function query(propertyKey: string) {
    return createParameterDecorator(function (context: EzContext) {
        if (context.url.query) {
            // TODO: Cache ?
            return querystring.parse(context.url.query)[propertyKey];
        }
    });
}