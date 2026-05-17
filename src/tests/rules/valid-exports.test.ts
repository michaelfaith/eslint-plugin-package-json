import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-exports', rules['valid-exports'], {
  invalid: [
    {
      code: `{
	"exports": null
}
`,
      errors: [
        {
          data: {
            error: 'the value is `null`, but should be an `object` or `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object` or `string`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be an entry point path',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": {
      "./invalid": 123
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the value of "./invalid" should be either an entry point path or an object of export conditions',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": {
      "./invalid": ""
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the value of "./invalid" is empty, but should be an entry point path',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": {
      "": "invalid"
    }
}
`,
      errors: [
        {
          data: {
            error:
              'property 0 has an empty key, but should be an export condition',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"exports": {
      "": "invalid",
      "   ": "invalid"
    }
}
`,
      errors: [
        {
          data: {
            error:
              'property 0 has an empty key, but should be an export condition',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 1 has an empty key, but should be an export condition',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "exports": "./index.js" }`,
    `{ "exports": { ".": "./index.js", "./secondary": "./secondary.js" } }`,
    `{ "exports": { ".": { "types": "./index.d.ts", "default": "./index.js" } } }`,
  ],
});
