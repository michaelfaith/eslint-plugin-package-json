import { rule } from '../../rules/restrict-top-level-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('restrict-top-level-properties', rule, {
  invalid: [
    {
      code: `{
				"name": "test",
				"prettier": { "semi": false }
			}`,
      errors: [
        {
          data: { customMessage: '', property: 'prettier' },
          line: 3,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'prettier' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test"
\t\t\t\t
			}`,
            },
          ],
        },
      ],

      name: 'simple string ban',
      options: [{ ban: ['prettier'] }],
    },
    {
      code: `{
				"name": "test",
				"pnpm": { "overrides": {} }
			}`,
      errors: [
        {
          data: {
            customMessage: ': Migrate pnpm config to pnpm-workspace.yaml.',
            property: 'pnpm',
          },
          line: 3,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test"
\t\t\t\t
			}`,
            },
          ],
        },
      ],
      name: 'object ban with custom message',
      options: [
        {
          ban: [
            {
              message: 'Migrate pnpm config to pnpm-workspace.yaml.',
              property: 'pnpm',
            },
          ],
        },
      ],
    },
    {
      code: `{ "name": "test", "lint-staged": {} }`,
      errors: [
        {
          data: { customMessage: '', property: 'lint-staged' },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'lint-staged' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'object ban without custom message',
      options: [{ ban: [{ property: 'lint-staged' }] }],
    },
    {
      code: `{
				"name": "test",
				"prettier": {},
				"eslintConfig": {}
			}`,
      errors: [
        {
          data: { customMessage: '', property: 'prettier' },
          line: 3,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'prettier' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
\t\t\t\t
				"eslintConfig": {}
			}`,
            },
          ],
        },
        {
          data: { customMessage: '', property: 'eslintConfig' },
          line: 4,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'eslintConfig' },
              messageId: 'removePropertySuggestion',
              output: `{
				"name": "test",
				"prettier": {}
\t\t\t\t
			}`,
            },
          ],
        },
      ],
      name: 'multiple banned properties',
      options: [{ ban: ['prettier', 'eslintConfig'] }],
    },
    {
      code: `{ "name": "test", "pnpm": {} }`,
      errors: [
        {
          data: {
            customMessage: ': Use pnpm-workspace.yaml instead.',
            property: 'pnpm',
          },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'object with message overrides preceding plain string (last wins)',
      options: [
        {
          ban: [
            'pnpm',
            {
              message: 'Use pnpm-workspace.yaml instead.',
              property: 'pnpm',
            },
          ],
        },
      ],
    },
    {
      code: `{ "name": "test", "pnpm": {} }`,
      errors: [
        {
          data: { customMessage: '', property: 'pnpm' },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'duplicate plain strings: still one error, no custom message',
      options: [{ ban: ['pnpm', 'pnpm'] }],
    },
    {
      code: `{ "name": "test", "pnpm": {} }`,
      errors: [
        {
          data: { customMessage: '', property: 'pnpm' },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'empty string message treated as no custom message',
      options: [{ ban: [{ message: '', property: 'pnpm' }] }],
    },
    {
      code: `{ "name": "test", "pnpm": {} }`,
      errors: [
        {
          data: {
            customMessage: ': Second message.',
            property: 'pnpm',
          },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'duplicate objects: last message wins',
      options: [
        {
          ban: [
            { message: 'First message.', property: 'pnpm' },
            { message: 'Second message.', property: 'pnpm' },
          ],
        },
      ],
    },
    {
      code: `{ "name": "test", "pnpm": {} }`,
      errors: [
        {
          data: { customMessage: '', property: 'pnpm' },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'pnpm' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'plain string after object: overrides to no custom message',
      options: [
        {
          ban: [
            {
              message: 'Use pnpm-workspace.yaml instead.',
              property: 'pnpm',
            },
            'pnpm',
          ],
        },
      ],
    },
    {
      code: `{ "description": "A package", "name": "test" }`,
      errors: [
        {
          data: { customMessage: '', property: 'description' },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'description' },
              messageId: 'removePropertySuggestion',
              output: `{  "name": "test" }`,
            },
          ],
        },
      ],
      name: 'standard package.json property can also be banned',
      options: [{ ban: ['description'] }],
    },
    {
      code: `{ "name": "test", "constructor": {} }`,
      errors: [
        {
          data: {
            customMessage: ': This is not a valid package.json property.',
            property: 'constructor',
          },
          line: 1,
          messageId: 'bannedProperty',
          suggestions: [
            {
              data: { property: 'constructor' },
              messageId: 'removePropertySuggestion',
              output: `{ "name": "test"  }`,
            },
          ],
        },
      ],
      name: 'inherited Object.prototype property name can be explicitly banned',
      options: [
        {
          ban: [
            {
              message: 'This is not a valid package.json property.',
              property: 'constructor',
            },
          ],
        },
      ],
    },
  ],
  valid: [
    {
      code: `{ "name": "test", "prettier": {} }`,
      name: 'empty ban list',
      options: [{ ban: [] }],
    },
    {
      code: `{ "name": "test", "constructor": {} }`,
      name: 'inherited Object.prototype property name not in ban list should not be flagged',
      options: [{ ban: ['prettier'] }],
    },
    {
      code: `{ "name": "test", "version": "1.0.0" }`,
      name: 'property not in ban list',
      options: [{ ban: ['prettier'] }],
    },
    {
      code: `{ "name": "test" }`,
      name: 'banned property not present',
      options: [{ ban: ['prettier', { property: 'pnpm' }] }],
    },
    {
      code: `{}`,
      name: 'empty package',
      options: [{ ban: ['prettier'] }],
    },
    {
      code: `{ "name": "test", 1: "value" }`,
      name: 'non-string literal key is skipped',
      options: [{ ban: ['1'] }],
    },
  ],
});
