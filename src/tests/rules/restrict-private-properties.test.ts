import { rule } from '../../rules/restrict-private-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('restrict-private-properties', rule, {
  invalid: [
    // Default blocked properties: files (non-empty, with suggestion)
    {
      code: `{
				"name": "test",
				"private": true,
				"files": ["dist"]
			}`,
      errors: [
        {
          data: { property: 'files' },
          messageId: 'unnecessaryProperty',
          suggestions: [
            {
              data: { property: 'files' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
            },
          ],
        },
      ],
    },
    // Default blocked properties: publishConfig (non-empty, with suggestion)
    {
      code: `{
				"name": "test",
				"private": true,
				"publishConfig": {
					"access": "public"
				}
			}`,
      errors: [
        {
          data: { property: 'publishConfig' },
          messageId: 'unnecessaryProperty',
          suggestions: [
            {
              data: { property: 'publishConfig' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
            },
          ],
        },
      ],
    },
    // Empty files array (auto-fixable)
    {
      code: `{ "private": true, "files": [] }`,
      errors: [
        {
          data: { property: 'files' },
          messageId: 'unnecessaryProperty',
        },
      ],
      output: `{ "private": true  }`,
    },
    // Empty publishConfig object (auto-fixable)
    {
      code: `{
				"name": "test",
				"private": true,
				"publishConfig": {}
			}`,
      errors: [
        {
          data: { property: 'publishConfig' },
          messageId: 'unnecessaryProperty',
        },
      ],
      output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
    },
    // Multiple blocked properties (mixed empty/non-empty)
    {
      code: `{
				"name": "test",
				"private": true,
				"files": ["dist"],
				"publishConfig": {}
			}`,
      errors: [
        {
          data: { property: 'files' },
          messageId: 'unnecessaryProperty',
          suggestions: [
            {
              data: { property: 'files' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"private": true,
\t\t\t\t
				"publishConfig": {}
			}`,
            },
          ],
        },
        {
          data: { property: 'publishConfig' },
          messageId: 'unnecessaryProperty',
        },
      ],
      output: `{
				"name": "test",
				"private": true,
				"files": ["dist"]
\t\t\t\t
			}`,
    },
    // Custom blocked properties (non-empty, with suggestion)
    {
      code: `{
				"name": "test",
				"private": true,
				"dependencies": {
					"foo": "^1.0.0"
				}
			}`,
      errors: [
        {
          data: { property: 'dependencies' },
          messageId: 'unnecessaryProperty',
          suggestions: [
            {
              data: { property: 'dependencies' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
            },
          ],
        },
      ],
      options: [{ blockedProperties: ['dependencies'] }],
    },
    // Custom blocked properties (empty, auto-fixable)
    {
      code: `{
				"name": "test",
				"private": true,
				"dependencies": {}
			}`,
      errors: [
        {
          data: { property: 'dependencies' },
          messageId: 'unnecessaryProperty',
        },
      ],
      options: [{ blockedProperties: ['dependencies'] }],
      output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
    },
    // Options object without blockedProperties (uses default)
    {
      code: `{
				"name": "test",
				"private": true,
				"files": ["dist"]
			}`,
      errors: [
        {
          data: { property: 'files' },
          messageId: 'unnecessaryProperty',
          suggestions: [
            {
              data: { property: 'files' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"private": true
\t\t\t\t
			}`,
            },
          ],
        },
      ],
      options: [{}],
    },
  ],
  valid: [
    // Not a private package
    `{
			"name": "test",
			"files": ["dist"]
		}`,
    // Private but no blocked properties
    `{
			"name": "test",
			"private": true,
			"scripts": {
				"test": "vitest"
			}
		}`,
    // Private with dependencies (not blocked by default)
    `{
			"name": "test",
			"private": true,
			"dependencies": {
				"foo": "^1.0.0"
			}
		}`,
    // Private is false
    `{
			"name": "test",
			"private": false,
			"files": ["dist"]
		}`,
    // Empty blockedProperties
    {
      code: `{
				"name": "test",
				"private": true,
				"files": [],
				"publishConfig": {}
			}`,
      options: [{ blockedProperties: [] }],
    },
    // Options object without blockedProperties (uses default)
    {
      code: `{
				"name": "test",
				"private": true,
				"dependencies": {
					"foo": "^1.0.0"
				}
			}`,
      options: [{}],
    },
  ],
});
