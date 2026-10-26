import { validateLicense, validateName } from 'package-json-validator';
import { describe, expect, it } from 'vitest';

import { createSimpleValidPropertyRule } from './createSimpleValidPropertyRule.ts';

describe(createSimpleValidPropertyRule, () => {
  it('should mark the rule as recommended by default', () => {
    const { rule } = createSimpleValidPropertyRule('name', validateName);

    expect(rule.meta.docs?.recommended).toBe(true);
  });

  it('should not mark the rule as recommended when isRecommended is false', () => {
    const { rule } = createSimpleValidPropertyRule('name', validateName, {
      isRecommended: false,
    });

    expect(rule.meta.docs?.recommended).toBe(false);
  });

  it('should include the aliases in the rule description', () => {
    const { rule } = createSimpleValidPropertyRule('license', validateLicense, {
      aliases: ['licence'],
    });

    expect(rule.meta.docs?.description).toBe(
      'Enforce that the `license` property (or its alias `licence`) is valid.',
    );
  });
});
