import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-files', rules['valid-files'], {
  invalid: [
    {
      code: `{
	"files": null
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
	"files": 123
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
	"files": "invalid"
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
	"files": {
      "invalid-bin": 123
    }
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
	"files": [
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
            error: 'item at index 1 is empty, but should be a file pattern',
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
  valid: ['{}', `{ "files": [] }`, `{ "files": ["CHANGELOG.md", "dist/"] }`],
});
