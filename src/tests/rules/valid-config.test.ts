import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-config', rules['valid-config'], {
  invalid: [
    {
      code: `{
	"config": null
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
	"config": 123
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
	"config": "./script.js"
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
	"config": []
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object`, not `array`',
          },
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "config": { "silver-mt-zion": "node ./silver-mt-zion.js" } }`,
    `{ "config": { "silver-mt-zion": "node ./silver-mt-zion.js", "nin": "node ./nin.js" } }`,
    `{ "config": { "silver-mt-zion": {"leadSinger": "Efrim Manuel Menuck"}, "nin": "node ./nin.js" } }`,
  ],
});
