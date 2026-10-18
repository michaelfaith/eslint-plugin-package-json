import { rule } from '../../rules/consistent-property-aliases.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('consistent-property-aliases', rule, {
  invalid: [
    {
      code: `{ "licence": "MIT" }`,
      errors: [
        {
          data: { preferred: 'license', present: 'licence' },
          messageId: 'preferAlias',
        },
      ],
      output: `{ "license": "MIT" }`,
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      errors: [
        {
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          messageId: 'preferAlias',
        },
      ],
      output: `{ "bundleDependencies": ["abc"] }`,
    },
    {
      code: `{ "license": "MIT" }`,
      errors: [
        {
          data: { preferred: 'licence', present: 'license' },
          messageId: 'preferAlias',
        },
      ],
      options: [{ prefer: { license: 'licence' } }],
      output: `{ "licence": "MIT" }`,
    },
    {
      code: `{ "bundleDependencies": ["abc"] }`,
      errors: [
        {
          data: {
            preferred: 'bundledDependencies',
            present: 'bundleDependencies',
          },
          messageId: 'preferAlias',
        },
      ],
      options: [{ prefer: { bundleDependencies: 'bundledDependencies' } }],
      output: `{ "bundledDependencies": ["abc"] }`,
    },
    // Options are merged with the defaults: `bundleDependencies` keeps its
    // default preference even though only `license` is configured
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      errors: [
        {
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          messageId: 'preferAlias',
        },
      ],
      options: [{ prefer: { license: 'licence' } }],
      output: `{ "bundleDependencies": ["abc"] }`,
    },
    // The property is renamed in place, sorting is left to `order-properties`
    {
      code: `{
  "name": "pkg",
  "licence": "MIT",
  "version": "1.0.0"
}`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          line: 3,
          messageId: 'preferAlias',
        },
      ],
      output: `{
  "name": "pkg",
  "license": "MIT",
  "version": "1.0.0"
}`,
    },
    // Both spellings present: reported on the non-preferred one, never auto-fixed
    {
      code: `{ "license": "MIT", "licence": "MIT" }`,
      errors: [
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT"  }`,
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: `{ "license": "MIT", "licence": "MIT" }`,
      errors: [
        {
          column: 3,
          data: { other: 'licence', present: 'license' },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{  "licence": "MIT" }`,
            },
          ],
        },
      ],
      options: [{ prefer: { license: 'licence' } }],
      output: null,
    },
    // `false` still reports both spellings being present, and offers to remove either one
    {
      code: `{ "license": "MIT", "licence": "Apache-2.0" }`,
      errors: [
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{  "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT"  }`,
            },
          ],
        },
      ],
      options: [{ prefer: { license: false } }],
      output: null,
    },
    {
      code: `{ "bundledDependencies": ["abc"], "bundleDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: {
            other: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'bundleDependencies' },
              messageId: 'removeProperty',
              output: `{ "bundledDependencies": ["abc"]  }`,
            },
            {
              data: { property: 'bundledDependencies' },
              messageId: 'removeProperty',
              output: `{  "bundleDependencies": ["abc"] }`,
            },
          ],
        },
      ],
      options: [{ prefer: { bundleDependencies: false } }],
      output: null,
    },
    // A repeated alias is reported once, on its first occurrence, without a fix:
    // renaming every occurrence would produce duplicate keys
    {
      code: `{ "licence": "MIT", "licence": "Apache-2.0" }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          messageId: 'preferAlias',
        },
      ],
      output: null,
    },
    // Likewise, a repeated spelling gets no removal suggestion when both spellings
    // are present: removing one occurrence would leave the spelling in place
    {
      code: `{ "licence": "MIT", "licence": "Apache-2.0", "license": "ISC" }`,
      errors: [
        {
          column: 3,
          data: { other: 'license', present: 'licence' },
          messageId: 'bothAliasesPresent',
          suggestions: [],
        },
      ],
      output: null,
    },
    {
      code: `{ "license": "ISC", "licence": "MIT", "licence": "Apache-2.0" }`,
      errors: [
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{  "licence": "MIT", "licence": "Apache-2.0" }`,
            },
          ],
        },
      ],
      options: [{ prefer: { license: false } }],
      output: null,
    },
    {
      code: `{ "licence": "MIT", "bundledDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          messageId: 'preferAlias',
        },
        {
          column: 21,
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          messageId: 'preferAlias',
        },
      ],
      output: `{ "license": "MIT", "bundleDependencies": ["abc"] }`,
    },
    // `true` enforces the canonical spelling, the same as leaving the property unset
    {
      code: `{ "licence": "MIT" }`,
      errors: [
        {
          data: { preferred: 'license', present: 'licence' },
          messageId: 'preferAlias',
        },
      ],
      options: [{ prefer: { license: true } }],
      output: `{ "license": "MIT" }`,
    },
    {
      code: `{ "license": "MIT", "licence": "MIT" }`,
      errors: [
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT"  }`,
            },
          ],
        },
      ],
      options: [{ prefer: { license: true } }],
      output: null,
    },
  ],
  valid: [
    `{}`,
    `{ "license": "MIT" }`,
    `{ "bundleDependencies": ["abc"] }`,
    {
      code: `{ "licence": "MIT" }`,
      options: [{ prefer: { license: 'licence' } }],
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      options: [{ prefer: { bundleDependencies: 'bundledDependencies' } }],
    },
    {
      code: `{ "licence": "MIT" }`,
      options: [{ prefer: { license: false } }],
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      options: [{ prefer: { bundleDependencies: false } }],
    },
    // Only top-level properties are checked
    `{ "publishConfig": { "bundledDependencies": ["abc"] } }`,
    `{ "workspaces": { "licence": "MIT" } }`,
    // Unquoted keys aren't valid in a package.json to begin with
    `{ licence: "MIT" }`,
    // `true` enforces the canonical spelling, the same as leaving the property unset
    {
      code: `{ "bundleDependencies": ["abc"] }`,
      options: [{ prefer: { bundleDependencies: true } }],
    },
  ],
});
