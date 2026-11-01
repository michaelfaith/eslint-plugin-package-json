import { rule } from '../../rules/require-override-restrictions.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('require-override-restrictions', rule, {
  invalid: [
    {
      code: '{"overrides":{"path-to-regexp":"0.1.13"}}',
      errors: [
        {
          column: 15,
          data: { selector: 'path-to-regexp' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"@example/library":"1.2.3"}}',
      errors: [
        {
          column: 15,
          data: { selector: '@example/library' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"ws@*":"6.2.3"}}',
      errors: [
        {
          column: 15,
          data: { selector: 'ws@*' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"@example/library@*":"1.2.3"}}',
      errors: [
        {
          column: 15,
          data: { selector: '@example/library@*' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"ws@latest":"6.2.3"}}',
      errors: [
        {
          column: 15,
          data: { selector: 'ws@latest' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"@scope":"1.0.0"}}',
      errors: [
        {
          column: 15,
          data: { selector: '@scope' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"@scope/package@not-a-semver-range":"1.0.0"}}',
      errors: [
        {
          column: 15,
          data: { selector: '@scope/package@not-a-semver-range' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"ws":{"version":"6.2.3"}}}',
      errors: [
        {
          column: 15,
          data: { selector: 'ws' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: '{"overrides":{"foo":"2.0.0","@scope/bar":"3.0.0"}}',
      errors: [
        {
          column: 15,
          data: { selector: 'foo' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
        {
          column: 29,
          data: { selector: '@scope/bar' },
          line: 1,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
    {
      code: `{
  "overrides": {
    "debug": "4.0.0"
  }
}`,
      errors: [
        {
          column: 5,
          data: { selector: 'debug' },
          line: 3,
          messageId: 'unrestrictedOverride',
        },
      ],
    },
  ],
  valid: [
    '{}',
    '{"overrides":{}}',
    '{"overrides":{"ws@6.2.x":"~6.2.3"}}',
    '{"overrides":{"ws@6.2.x < 6.2.3":"~6.2.3"}}',
    '{"overrides":{"ws@6.2.5":"6.2.3"}}',
    '{"overrides":{"@scope/library@>=2.0.0 <3.0.0":"2.4.0"}}',
    '{"overrides":null}',
    '{"overrides":true}',
    '{"overrides":{"@example/library@^1.0.0":"1.2.3"}}',
    '{"overrides":{"path-to-regexp@~0.1.12":"0.1.13"}}',
    '{"overrides":{"my-library@1.4.0":{"path-to-regexp":"8.4.0"}}}',
    '{"overrides":{"ws@1.0.0":{".":"1.0.1","debug":"4.0.0"}}}',
    '{"overrides":[]}',
    '{"pnpm":{"overrides":{"ws":"6.2.3"}}}',
    '{ "overrides": { 1: "0.0.1" } }',
  ],
});
