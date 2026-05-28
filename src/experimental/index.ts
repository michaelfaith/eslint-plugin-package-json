import { plugin } from './plugin.ts';

export type { PackageJsonPluginSettings } from '../createRule.ts';

export const configs = plugin.configs;
export const rules = plugin.rules;

export default plugin;
