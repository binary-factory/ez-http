import { EzRoutePath } from '../router/route';
import { HttpMethod } from '../http/http-method';

export interface ControllerMethodMetadata {
    target: any;
    propertyKey: string;
    path: EzRoutePath;
    method: HttpMethod | string;
}