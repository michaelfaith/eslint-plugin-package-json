import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-scripts', rules['valid-scripts'], {
  invalid: [
    {
      code: `{
	"scripts": null
}
`,
      errors: [
        {
          data: {
            error: 'the value is `null`, but should be an `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": "./script.js"
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": {
      "invalid": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value of property "invalid" should be a string',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": {
      "invalid": ""
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the value of property "invalid" is empty, but should be a script command',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": {
      "": "invalid"
    }
}
`,
      errors: [
        {
          data: {
            error: 'property 0 has an empty key, but should be a script name',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"scripts": {
      "": "invalid",
      "   ": "invalid"
    }
}
`,
      errors: [
        {
          data: {
            error: 'property 0 has an empty key, but should be a script name',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'property 1 has an empty key, but should be a script name',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "scripts": { "silver-mt-zion": "node ./silver-mt-zion.js" } }`,
    `{ "scripts": { "silver-mt-zion": "node ./silver-mt-zion.js", "nin": "node ./nin.js" } }`,
  ],
});
