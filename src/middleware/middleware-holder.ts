import { EzMiddleware, EzMiddlewareLike, MiddlewareAction } from './middleware';
import { EzContext } from './context';

export abstract class EzMiddlewareHolder extends EzMiddleware {

    protected _children: EzMiddleware[] = [];

    use(...middlewares: EzMiddlewareLike[]) {
        const holders: EzMiddleware[] = [];
        for (const middleware of middlewares) {
            if (typeof middleware === 'function') {
                // Wrap function within anonymous instance of Middleware.
                const holder = new class extends EzMiddleware {
                    execute(context: EzContext): MiddlewareAction | Promise<MiddlewareAction> {
                        return middleware(context) || MiddlewareAction.Continue;
                    }
                };

                holders.push(holder);
            } else {
                holders.push(middleware);
            }
        }

        // Set parent for all.
        for (const holder of holders) {
            holder.parent = this;
        }

        this._children.push(...holders);
    }

    async execute(context: EzContext): Promise<MiddlewareAction> {
        return this.executeMultiple(context, this.compose(context));
    }

    async executeMultiple(context: EzContext, children: EzMiddleware[]): Promise<MiddlewareAction> {
        let action: MiddlewareAction = MiddlewareAction.Continue;

        for (const child of children) {

            await child.setup(context);

            if (child.canActivate(context)) {

                action = await child.execute(context);
                if (action !== MiddlewareAction.Continue) {
                    return this.gradateAction(action);
                }

            }

            await child.teardown(context);
        }

        return MiddlewareAction.Continue;
    }

    protected compose(context: EzContext): EzMiddleware[] {
        return this._children;
    }

    private gradateAction(action: MiddlewareAction): MiddlewareAction {
        if (MiddlewareAction.Continue) {
            return MiddlewareAction.Continue;
        } else if (action === MiddlewareAction.SkipHolder) {
            return MiddlewareAction.Continue;
        } else if (action === MiddlewareAction.SkipAll) {
            return MiddlewareAction.SkipAll;
        }
    }

    get children(): EzMiddleware[] {
        return this._children;
    }

    set children(value: EzMiddleware[]) {
        this._children = value;
    }
}