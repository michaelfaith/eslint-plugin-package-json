import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-private', rules['valid-private'], {
  invalid: [
    {
      code: `{
	"private": null
}
`,
      errors: [
        {
          data: {
            error: 'the value is `null`, but should be a `boolean`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"private": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `boolean`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"private": "true"
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `boolean`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"private": {}
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `boolean`, not `object`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"private": []
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `boolean`, not `Array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: ['{}', `{ "private": true }`, `{ "private": false }`],
});
