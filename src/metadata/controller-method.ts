import { Metadata } from './metadata';
import { EzRoutePath } from '../router/route';

export interface ControllerMethodMetadata extends Metadata {
    path: EzRoutePath;
    method: string;
}