import { plugin } from '../plugin.ts';

export type { PackageJsonPluginSettings } from '../createRule.ts';

export const configs = plugin.configs;
export { rules } from './compat.ts';

export default plugin;
