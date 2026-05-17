import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-type', rules['valid-type'], {
  invalid: [
    {
      code: `{
	"type": null
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
	"type": 123
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
	"type": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be one of: commonjs, module',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: ['{}', `{ "type": "commonjs" }`, `{ "type": "module" }`],
});
