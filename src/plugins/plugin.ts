import { EzContext } from '../core/context';

export abstract class EzPlugin {

    constructor(private _name: string) {

    }

    get name(): string {
        return this._name;
    }

    abstract activate(): void | Promise<void>;

    abstract setupContext(context: EzContext): void | Promise<void>;

    abstract prepare(context: EzContext): void | Promise<void>;

    abstract finish(context: EzContext): void | Promise<void>;
}