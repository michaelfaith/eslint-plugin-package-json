import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-directories', rules['valid-directories'], {
  invalid: [
    {
      code: `{
	"directories": null
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
	"directories": 123
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
	"directories": "./script.js"
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
	"directories": []
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object`, not `array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: ['{}', `{ "directories": { "bin": "dist/bin", "man": "docs" } }`],
});
