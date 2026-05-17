import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-packageManager', rules['valid-packageManager'], {
  invalid: [
    {
      code: `{
	"packageManager": null
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
	"packageManager": 123
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
	"packageManager": ""
}
`,
      errors: [
        {
          data: {
            error:
              'the value is empty, but should be the name and version of a package manager (e.g. "pnpm@10.3.0")',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"packageManager": "pnpm"
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be in the form "name@version" (e.g. "pnpm@10.3.0")',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"packageManager": "invalid@10.3.0"
}
`,
      errors: [
        {
          data: {
            error:
              'the package manager "invalid" is not supported. Supported package managers are: npm, pnpm, yarn, bun, deno',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"packageManager": "pnpm@invalid"
}
`,
      errors: [
        {
          data: {
            error:
              'the version "invalid" is not valid. It should be a valid semver version (optionally with a hash).',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"packageManager": "pnpm@^10.3.0"
}
`,
      errors: [
        {
          data: {
            error:
              'the version "^10.3.0" is not valid. It should be a valid semver version (optionally with a hash).',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"packageManager": "unsupported@invalid"
}
`,
      errors: [
        {
          data: {
            error:
              'the package manager "unsupported" is not supported. Supported package managers are: npm, pnpm, yarn, bun, deno',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the version "invalid" is not valid. It should be a valid semver version (optionally with a hash).',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "packageManager": "npm@11.1.0" }`,
    `{ "packageManager": "pnpm@10.3.0" }`,
    `{ "packageManager": "yarn@4.2.3" }`,
    `{ "packageManager": "bun@1.0.0" }`,
    `{ "packageManager": "deno@1.0.0" }`,
    `{ "packageManager": "yarn@4.2.3+sha224.953c8233f7a92884eee2de69a1b92d1f2ec1655e66d08071ba9a02fa" }`,
  ],
});
