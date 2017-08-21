import { EzContext } from '../middleware/context';

export abstract class EzPlugin {

    abstract activate(): void | Promise<void>;
    
    abstract prepare(context: EzContext): void | Promise<void>;

    abstract finish(context: EzContext): void | Promise<void>;
}