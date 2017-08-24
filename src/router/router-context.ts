import { EzRoute } from './route';

export class RouterContext {
    private _dirty: EzRoute[] = [];
    private _route: EzRoute;

    get dirty(): EzRoute[] {
        return this._dirty;
    }

    set dirty(value: EzRoute[]) {
        this._dirty = value;
    }

    get route(): EzRoute {
        return this._route;
    }

    set route(value: EzRoute) {
        this._route = value;
    }
}