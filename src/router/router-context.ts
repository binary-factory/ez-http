import { EzRoute } from './route';

export class RouterContext {
    private _dirty: boolean;
    private _route: EzRoute;

    get dirty(): boolean {
        return this._dirty;
    }

    set dirty(value: boolean) {
        this._dirty = value;
    }

    get route(): EzRoute {
        return this._route;
    }

    set route(value: EzRoute) {
        this._route = value;
    }
}