import type { ESLint } from 'eslint';

import { toCompatRule } from 'eslint-json-compat-utils';

import { plugin as originalPlugin } from '../plugin.ts';

const rules = Object.fromEntries(
  Object.entries(originalPlugin.rules).map(([name, rule]) => [
    name,
    toCompatRule(rule),
  ]),
);

export const plugin = {
  configs: {
    recommended: {
      files: ['**/package.json'],
      language: 'json/json',
      name: 'package-json/experimental-recommended',
      plugins: {
        get 'package-json'(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: originalPlugin.configs.recommended.rules,
    },
    stylistic: {
      files: ['**/package.json'],
      language: 'json/json',
      name: 'package-json/experimental-stylistic',
      plugins: {
        get 'package-json'(): ESLint.Plugin {
          return plugin;
        },
      },
      rules: originalPlugin.configs.stylistic.rules,
    },
  },
  meta: originalPlugin.meta,
  rules,
} satisfies ESLint.Plugin;
