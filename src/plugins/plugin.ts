import { EzContext } from '../core/context';

export abstract class EzPlugin {

    constructor(private _name: string) {

    }

    get name(): string {
        return this._name;
    }

    abstract setupContext(context: EzContext): void;
}