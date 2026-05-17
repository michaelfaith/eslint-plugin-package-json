import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-bundleDependencies', rules['valid-bundleDependencies'], {
  invalid: ['bundleDependencies', 'bundledDependencies'].flatMap((property) => [
    {
      code: `{
	"${property}": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value is `null`, but should be an `Array` or a `boolean`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"${property}": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array` or `boolean`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"${property}": "invalid"
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array` or `boolean`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"${property}": {
      "invalid-bin": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `Array` or `boolean`, not `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"${property}": [
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
            error: 'item at index 1 is empty, but should be a dependency name',
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
  ]),
  valid: [
    '{}',
    ...['bundleDependencies', 'bundledDependencies'].flatMap((property) => [
      `{ "${property}": true }`,
      `{ "${property}": false }`,
      `{ "${property}": [] }`,
      `{ "${property}": ["nin", "silver-mt-zion"] }`,
    ]),
  ],
});
