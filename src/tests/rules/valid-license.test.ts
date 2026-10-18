import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-license', rules['valid-license'], {
  invalid: ['license', 'licence'].flatMap((property) => [
    {
      code: `{
	"${property}": null
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
	"${property}": 123
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
	"${property}": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be a valid license',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"${property}": "not-a-license"
}
`,
      errors: [
        {
          data: {
            error:
              'license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>"',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ]),
  valid: [
    '{}',
    ...['license', 'licence'].flatMap((property) => [
      `{ "${property}": "MIT" }`,
      `{ "${property}": "UNLICENSED" }`,
      `{ "${property}": "SEE LICENSE IN LICENSE.md" }`,
    ]),
  ],
});
