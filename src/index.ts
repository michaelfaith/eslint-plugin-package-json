import { plugin } from './plugin.ts';

export const rules = plugin.rules;
export const configs = plugin.configs;

export default plugin;

export type { PackageJsonPluginSettings } from './createRule.ts';
