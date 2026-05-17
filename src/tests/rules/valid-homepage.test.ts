import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-homepage', rules['valid-homepage'], {
  invalid: [
    {
      code: `{
	"homepage": null
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
	"homepage": 123
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
	"homepage": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be a valid url',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"homepage": "not-a-homepage"
}
`,
      errors: [
        {
          data: {
            error: 'the value is not a valid url',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "homepage": "https://nin.com" }`,
    `{ "homepage": "http://gybe.com" }`,
  ],
});
