import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-version', rules['valid-version'], {
  invalid: [
    {
      code: `{
	"version": null
}
`,
      errors: [
        {
          column: 13,
          data: {
            error: 'the value is `null`, but should be a `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": 123 }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the type should be a `string`, not `number`',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": "" }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the value is empty, but should be a valid version',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": "latest" }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the value is not a valid semver version',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": "?!" }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the value is not a valid semver version',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": "1" }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the value is not a valid semver version',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{ "version": "1.2" }`,
      errors: [
        {
          column: 14,
          data: {
            error: 'the value is not a valid semver version',
          },
          line: 1,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "version": "1.2.3" }`,
    `{ "version": "1.2.3-beta" }`,
    `{ "version": "1.2.3-beta.0" }`,
  ],
});
