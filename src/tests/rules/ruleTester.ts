import { ESLint, RuleTester } from 'eslint';
import * as jsoncESLintParser from 'jsonc-eslint-parser';
import semver from 'semver';
import * as vitest from 'vitest';

import type { PackageJsonRuleModule } from '../../createRule.ts';

export type JsonRuleTester = RuleTester & {
  run: JsonRuleTesterRun;
};

export type JsonRuleTesterRun = (
  name: string,
  rule: PackageJsonRuleModule,
  tests: {
    invalid?: RuleTester.InvalidTestCase[] | undefined;
    valid?: (RuleTester.ValidTestCase | string)[] | undefined;
  },
) => void;

RuleTester.describe = vitest.describe;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;

export const ruleTester = new RuleTester({
  languageOptions: { parser: jsoncESLintParser },
}) as JsonRuleTester;

const originalRun = ruleTester.run;

ruleTester.run = (name, rule, tests) => {
  originalRun.call(ruleTester, name, rule as PackageJsonRuleModule, {
    // Assertion options were added in ESLint v10.
    ...(semver.gte(ESLint.version, '10.0.0') && {
      assertionOptions: {
        requireData: true,
        requireMessage: true,
      },
    }),
    invalid: tests.invalid?.map((test) => ({
      filename: 'package.json',
      ...test,
    })),
    valid: tests.valid?.map((test) => ({
      filename: 'package.json',
      ...(typeof test === 'string' ? { code: test } : { ...test }),
    })),
  });
};
