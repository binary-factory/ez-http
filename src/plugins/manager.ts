import { EzPlugin } from './plugin';

export namespace EzPluginManager {
    export const plugins: EzPlugin[] = [];

    export async function registerPlugin(plugin: EzPlugin) {
        await plugin.activate(); //TODO: Rethrow semantic error.
        this.plugins.push(plugin);
    }

}