import type { ESLint } from 'eslint';
import { toCompatRule } from 'eslint-json-compat-utils';

import { plugin as originalPlugin } from '../plugin.ts';

const language = 'json/json';

const rules = Object.fromEntries(
  Object.entries(originalPlugin.rules).map(([name, rule]) => [
    name,
    toCompatRule(rule),
  ]),
);

// Add `meta.languages` to enforce use of the json/json language.
for (const rule of Object.values(rules)) {
  // Manually add the `languages` property in the types, since ESLint v9 types doesn't include it (resulting in a type check error in CI).
  (rule.meta as { languages?: string[] }).languages ??= [language];
}

export const plugin = {
  configs: {
    recommended: {
      files: ['**/package.json'],
      language,
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
      language,
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
