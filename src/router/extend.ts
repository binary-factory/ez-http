import { EzContext } from '../middleware/context';
import { RouterContext } from './router-context';

declare module '../middleware/context' {
    interface EzContext {
        router: RouterContext;
        params: { [key: string]: string };
    }
}