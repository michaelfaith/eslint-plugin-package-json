import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-man', rules['valid-man'], {
  invalid: [
    {
      code: `{
	"man": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value is `null`, but should be an `Array` or a `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"man": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array` or `string`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"man": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be the path to a man file',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"man": {
      "invalid-bin": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array` or `string`, not `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"man": [
      "./man/doc.one",
      "./man/doc.gz",
      "./man/doc.Infinity",
      "man/doc",
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
              'item at index 0 is not valid; it should be the path to a man file',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 1 is not valid; it should be the path to a man file',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 2 is not valid; it should be the path to a man file',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 3 is not valid; it should be the path to a man file',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 4 is empty, but should be the path to a man file',
          },
          line: 7,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 5 should be a string, not `number`',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 6 should be a string, not `null`',
          },
          line: 9,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'item at index 7 should be a string, not `object`',
          },
          line: 10,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "man": [] }`,
    `{ "man": ["./man/doc.1", "./man/doc.2.gz"] }`,
  ],
});
