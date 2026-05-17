import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-engines', rules['valid-engines'], {
  invalid: [
    {
      code: `{
	"engines": null
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
	"engines": 123
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
	"engines": []
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object`, not `Array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"engines": "invalid"
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
	"engines": {
      "npm": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value of property "npm" should be a string',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"engines": {
      "invalid-bin": ""
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the value of property "invalid-bin" is empty, but should be a semver range',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"engines": {
      "": "invalid-key",
      "   ": "invalid-key"
    }
}
`,
      errors: [
        {
          data: {
            error:
              'property 0 has an empty key, but should be a runtime or package manager',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 1 has an empty key, but should be a runtime or package manager',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    `{ "engines": { "node": "^24.11.0" } }`,
    `{ "engines": { "node": "^24.11.0", "npm": "Please use pnpm", "pnpm": "^10" } }`,
  ],
});
