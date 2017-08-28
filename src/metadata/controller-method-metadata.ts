import { EzRoutePath } from '../router/route';

export interface ControllerMethodMetadata {
    target: any;
    propertyKey: string;
    path: EzRoutePath;
    method: string;
}