import { EzContext } from '../middleware/context';

export interface ControllerMethodParameterMetadata {
    index: number;
    provider: (context: EzContext) => any;
}