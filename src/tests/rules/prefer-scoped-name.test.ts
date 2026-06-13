import { rule } from '../../rules/prefer-scoped-name.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('prefer-scoped-name', rule, {
  invalid: [
    // Only preferred option
    {
      code: `{ "name": "missing-scope" }`,
      errors: [
        {
          data: {
            name: 'missing-scope',
            preferred: '@preferred'
          },
          line: 1,
          messageId: 'missingPreferredScope',
        },
      ],
      options: [{ preferred: '@preferred' }],
      output: `{ "name": "@preferred/missing-scope" }`,
    },
    {
      code: `{ "name": "@not/preferred-scope" }`,
      errors: [
        {
          data: {
            name: '@not/preferred-scope',
            preferred: '@is',
            scope: '@not'
          },
          line: 1,
          messageId: 'usePreferredScope',
        },
      ],
      options: [{ preferred: '@is' }],
      output: `{ "name": "@is/preferred-scope" }`,
    },

    // Only allowed option
    {
      code: `{ "name": "@not-single/allowed-scope" }`,
      errors: [
        {
          data: {
            name: '@not-single/allowed-scope',
            preferred: '@is',
            scope: '@not-single'
          },
          line: 1,
          messageId: 'useAllowedScope',
        },
      ],
      options: [{ allowed: '@is' }],
    },
    {
      code: `{ "name": "@not-multiple/allowed-scope" }`,
      errors: [
        {
          data: {
            preferred: '@is, @other',
            scope: '@not-multiple'
          },
          line: 1,
          messageId: 'useAllowedScope',
        },
      ],
      options: [{ allowed: [ '@is' , '@other'] }],
    },

    // Both preferred and allowed options
    {
      code: `{ "name": "@neither/preferred-or-allowed" }`,
      errors: [
        {
          data: {
            preferred: '@is',
            scope: '@neither'
          },
          line: 1,
          messageId: 'useAllowedScope',
        },
      ],
      options: [{ allowed: ['@allowed'], preferred: '@is'}],
      output: `{ "name": "@is/preferred-or-allowed" }`,
    },
  ],
  valid: [
    '{ }',
    {
      code: '{ }',
      options: [{ preferred: '@preferred' }]
    },
    {
      code: '{ }',
      options: [{ allowed: '@allowed' }]
    },
    {
      code: '{ }',
      options: [{ allowed: [ '@allowed' ], preferred: '@preferred' }]
    },
    {
      code: '{ "something": { "name": "these are not the name fields you are looking for" } }',
      options: [{ allowed: [ '@allowed' ], preferred: '@preferred' }]
    },
    {
      code: '{ "name": "@preferred/name" }',
      options: [{ preferred: '@preferred' }]
    },
    {
      code: '{ "name": "@allowed/name" }',
      options: [{ allowed: '@allowed' }]
    },
    {
      code: '{ "name": "@other/name" }',
      options: [{ allowed: [ '@allowed', '@other' ] }]
    },
    {
      code: '{ "name": "@preferred/name" }',
      options: [{ allowed: '@allowed', preferred: '@preferred' }]
    },
    {
      code: '{ "name": "@preferred/name" }',
      options: [{ allowed: [ '@allowed', '@other' ], preferred: '@preferred' }]
    },
    {
      code: '{ "name": "@allowed/name" }',
      options: [{ allowed: '@allowed', preferred: '@preferred' }]
    },
    {
      code: '{ "name": "@allowed/name" }',
      options: [{ allowed: [ '@allowed', '@other' ], preferred: '@preferred' }]
    }
  ]
});
