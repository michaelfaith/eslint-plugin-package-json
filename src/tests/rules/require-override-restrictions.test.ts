import { rule } from '../../rules/require-override-restrictions.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('require-override-restrictions', rule, {
  invalid: [
    {
      code: '{"overrides":{"path-to-regexp":"0.1.13"}}',
      errors: [{ data: { selector: 'path-to-regexp' }, messageId: 'unrestrictedOverride' }],
    },
    {
      code: '{"overrides":{"@example/library":"1.2.3"}}',
      errors: [{ data: { selector: '@example/library' }, messageId: 'unrestrictedOverride' }],
    },
    {
      code: '{"overrides":{"ws@*":"6.2.3"}}',
      errors: [{ data: { selector: 'ws@*' }, messageId: 'unrestrictedOverride' }],
    },
    {
      code: '{"overrides":{"ws@latest":"6.2.3"}}',
      errors: [{ data: { selector: 'ws@latest' }, messageId: 'unrestrictedOverride' }],
    },
    {
      code: '{"overrides":{"ws":{"version":"6.2.3"}}}',
      errors: [{ data: { selector: 'ws' }, messageId: 'unrestrictedOverride' }],
    },
    {
      code: '{"overrides":{"foo":"2.0.0","@scope/bar":"3.0.0"}}',
      errors: [
        { data: { selector: 'foo' }, messageId: 'unrestrictedOverride' },
        { data: { selector: '@scope/bar' }, messageId: 'unrestrictedOverride' },
      ],
    },
  ],
  valid: [
    '{}',
    '{"overrides":{}}',
    '{"overrides":{"ws@6.2.x":"~6.2.3"}}',
    '{"overrides":{"@example/library@^1.0.0":"1.2.3"}}',
    '{"overrides":{"path-to-regexp@~0.1.12":"0.1.13"}}',
    '{"overrides":{"my-library@1.4.0":{"path-to-regexp":"8.4.0"}}}',
    '{"overrides":{"ws@1.0.0":{".":"1.0.1","debug":"4.0.0"}}}',
    '{"overrides":[]}',
    '{"pnpm":{"overrides":{"ws":"6.2.3"}}}',
  ],
});
