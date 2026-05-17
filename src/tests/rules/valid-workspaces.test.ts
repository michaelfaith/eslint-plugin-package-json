import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-workspaces', rules['valid-workspaces'], {
  invalid: [
    {
      code: `{
	"workspaces": null
}
`,
      errors: [
        {
          data: {
            error: 'the value is `null`, but should be an `Array` of strings',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"workspaces": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"workspaces": "invalid"
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"workspaces": {}
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array`, not `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"workspaces": [
      "valid",
      "",
      123,
      null,
      {}
    ]
}
`,
      errors: [
        {
          data: {
            error:
              'item at index 1 is empty, but should be a file path or glob pattern',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 2 should be a string, not `number`',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 3 should be a string, not `null`',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 4 should be a string, not `object`',
          },
          line: 7,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "workspaces": [] }`,
    `{ "workspaces": ["./app", "./packages/*"] }`,
  ],
});
