import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-main', rules['valid-main'], {
  invalid: [
    {
      code: `{
	"main": null
}
`,
      errors: [
        {
          data: {
            error: 'the value is `null`, but should be a `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"main": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `string`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"main": []
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `string`, not `Array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"main": ""
}
`,
      errors: [
        {
          data: {
            error:
              "the value is empty, but should be the path to the package's main module",
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: ['{}', `{ "main": "./index.js" }`, `{ "main": "index.js" }`],
});
