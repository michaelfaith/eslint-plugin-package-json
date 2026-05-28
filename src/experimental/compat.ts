import { toCompatRule } from 'eslint-json-compat-utils';

import { plugin } from '../plugin.ts';

/** Re-export all rules in a form that's compatible with `@eslint/json` */
export const rules = Object.fromEntries(
  Object.entries(plugin.rules).map(([name, rule]) => [
    name,
    toCompatRule(rule),
  ]),
);
