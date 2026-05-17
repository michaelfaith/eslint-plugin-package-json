import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-sideEffects', rules['valid-sideEffects'], {
  invalid: [
    {
      code: `{
	"sideEffects": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value is `null`, but should be a `boolean` or an `Array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"sideEffects": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `boolean` or `Array`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"sideEffects": "invalid"
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `boolean` or `Array`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"sideEffects": {
      "invalid-bin": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `boolean` or `Array`, not `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"sideEffects": [
      "valid",
      "",
      123,
      null
    ]
}
`,
      errors: [
        {
          data: {
            error:
              'item at index 1 is empty, but should be a path to a file with side effects or a glob pattern',
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
      ],
    },
  ],
  valid: [
    '{}',
    `{ "sideEffects": true }`,
    `{ "sideEffects": false }`,
    `{ "sideEffects": [] }`,
    `{ "sideEffects": ["nin", "silver-mt-zion"] }`,
  ],
});
