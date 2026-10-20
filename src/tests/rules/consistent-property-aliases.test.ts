import { rule } from '../../rules/consistent-property-aliases.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('consistent-property-aliases', rule, {
  invalid: [
    {
      code: `{ "licence": "MIT" }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      output: `{ "license": "MIT" }`,
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      output: `{ "bundleDependencies": ["abc"] }`,
    },
    {
      code: `{ "license": "MIT" }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'licence', present: 'license' },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      name: 'license > prefer.license: licence',
      options: [{ prefer: { license: 'licence' } }],
      output: `{ "licence": "MIT" }`,
    },
    {
      code: `{ "bundleDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: {
            preferred: 'bundledDependencies',
            present: 'bundleDependencies',
          },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      name: 'bundleDependencies > prefer.bundleDependencies: bundledDependencies',
      options: [{ prefer: { bundleDependencies: 'bundledDependencies' } }],
      output: `{ "bundledDependencies": ["abc"] }`,
    },
    // Options are merged with the defaults: `bundleDependencies` keeps its
    // default preference even though only `license` is configured
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      name: 'bundledDependencies > prefer.license: licence',
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
      code: `{
  "license": "MIT",
  "licence": "MIT"
}`,
      errors: [
        {
          column: 3,
          data: { other: 'license', present: 'licence' },
          line: 3,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{
  "license": "MIT"
}`,
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
          column: 21,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT" }`,
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
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{ "licence": "MIT" }`,
            },
          ],
        },
      ],
      name: 'license and licence > prefer.license: licence',
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
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{ "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT" }`,
            },
          ],
        },
      ],
      name: 'license and licence > prefer.license: false',
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
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'bundleDependencies' },
              messageId: 'removeProperty',
              output: `{ "bundledDependencies": ["abc"] }`,
            },
            {
              data: { property: 'bundledDependencies' },
              messageId: 'removeProperty',
              output: `{ "bundleDependencies": ["abc"] }`,
            },
          ],
        },
      ],
      name: 'bundledDependencies and bundleDependencies > prefer.bundleDependencies: false',
      options: [{ prefer: { bundleDependencies: false } }],
      output: null,
    },
    // Each occurrence of a repeated spelling is reported and fixed on its own
    {
      code: `{ "licence": "MIT", "licence": "Apache-2.0" }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          line: 1,
          messageId: 'preferAlias',
        },
        {
          column: 21,
          data: { preferred: 'license', present: 'licence' },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      output: `{ "license": "MIT", "license": "Apache-2.0" }`,
    },
    {
      code: `{ "licence": "MIT", "licence": "Apache-2.0", "license": "ISC" }`,
      errors: [
        {
          column: 3,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "licence": "Apache-2.0", "license": "ISC" }`,
            },
          ],
        },
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "licence": "MIT", "license": "ISC" }`,
            },
          ],
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
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{ "licence": "MIT", "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "ISC", "licence": "Apache-2.0" }`,
            },
          ],
        },
        {
          column: 39,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'license' },
              messageId: 'removeProperty',
              output: `{ "licence": "MIT", "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "ISC", "licence": "MIT" }`,
            },
          ],
        },
      ],
      name: 'license and repeated licence > prefer.license: false',
      options: [{ prefer: { license: false } }],
      output: null,
    },
    // Removing a repeated spelling removes every copy of it at once
    {
      code: `{ "license": "ISC", "license": "MIT", "licence": "Apache-2.0" }`,
      errors: [
        {
          column: 39,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { count: 2, property: 'license' },
              messageId: 'removeAllProperties',
              output: `{ "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "ISC", "license": "MIT" }`,
            },
          ],
        },
      ],
      name: 'repeated license and licence > prefer.license: false',
      options: [{ prefer: { license: false } }],
      output: null,
    },
    {
      code: `{ "licence": "Apache-2.0", "license": "ISC", "license": "MIT" }`,
      errors: [
        {
          column: 3,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { count: 2, property: 'license' },
              messageId: 'removeAllProperties',
              output: `{ "licence": "Apache-2.0" }`,
            },
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "ISC", "license": "MIT" }`,
            },
          ],
        },
      ],
      name: 'licence and repeated license at the end > prefer.license: false',
      options: [{ prefer: { license: false } }],
      output: null,
    },
    {
      code: `{ "licence": "MIT", "bundledDependencies": ["abc"] }`,
      errors: [
        {
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          line: 1,
          messageId: 'preferAlias',
        },
        {
          column: 21,
          data: {
            preferred: 'bundleDependencies',
            present: 'bundledDependencies',
          },
          line: 1,
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
          column: 3,
          data: { preferred: 'license', present: 'licence' },
          line: 1,
          messageId: 'preferAlias',
        },
      ],
      name: 'licence > prefer.license: true',
      options: [{ prefer: { license: true } }],
      output: `{ "license": "MIT" }`,
    },
    {
      code: `{ "license": "MIT", "licence": "MIT" }`,
      errors: [
        {
          column: 21,
          data: { other: 'license', present: 'licence' },
          line: 1,
          messageId: 'bothAliasesPresent',
          suggestions: [
            {
              data: { property: 'licence' },
              messageId: 'removeProperty',
              output: `{ "license": "MIT" }`,
            },
          ],
        },
      ],
      name: 'license and licence > prefer.license: true',
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
      name: 'licence > prefer.license: licence',
      options: [{ prefer: { license: 'licence' } }],
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      name: 'bundledDependencies > prefer.bundleDependencies: bundledDependencies',
      options: [{ prefer: { bundleDependencies: 'bundledDependencies' } }],
    },
    {
      code: `{ "licence": "MIT" }`,
      name: 'licence > prefer.license: false',
      options: [{ prefer: { license: false } }],
    },
    {
      code: `{ "bundledDependencies": ["abc"] }`,
      name: 'bundledDependencies > prefer.bundleDependencies: false',
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
      name: 'bundleDependencies > prefer.bundleDependencies: true',
      options: [{ prefer: { bundleDependencies: true } }],
    },
  ],
});
