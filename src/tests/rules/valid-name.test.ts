import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-name', rules['valid-name'], {
  invalid: [
    {
      code: `{
	"name": null
}
`,
      errors: [
        {
          column: 10,
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
	"name": 123
}
`,
      errors: [
        {
          column: 10,
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
	"name": ""
}
`,
      errors: [
        {
          column: 10,
          data: {
            error: 'the value is empty, but should be a valid name',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"name": "excited!"
}
`,
      errors: [
        {
          column: 10,
          data: {
            error: 'name can no longer contain special characters ("~\'!()*")',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"name": "$!"
}
`,
      errors: [
        {
          column: 10,
          data: {
            error: 'name can only contain URL-friendly characters',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          column: 10,
          data: {
            error: 'name can no longer contain special characters ("~\'!()*")',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"name": " leading-space:and:weird:chars!"
}
`,
      errors: [
        {
          column: 10,
          data: {
            error: 'name cannot contain leading or trailing spaces',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          column: 10,
          data: {
            error: 'name can only contain URL-friendly characters',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          column: 10,
          data: {
            error: 'name can no longer contain special characters ("~\'!()*")',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"name": "InvalidPackageNameWithPrivateFalse",
	"private": false
}
`,
      errors: [
        {
          column: 10,
          data: {
            error: 'name can no longer contain capital letters',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "name": "valid-package-name" }`,
    `{ "name": "@scoped/valid-package-name" }`,
  ],
});
