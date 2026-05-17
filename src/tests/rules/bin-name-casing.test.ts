import { rule } from '../../rules/bin-name-casing.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('bin-name-casing', rule, {
  invalid: [
    {
      code: `{
                "bin": {
                    "silverMtZion": "silver-mt-zion.js",
                    "NIN": "./nin.js"
                }
            }`,
      errors: [
        {
          data: {
            property: 'silverMtZion',
          },
          line: 3,
          messageId: 'invalidCase',
          suggestions: [
            {
              data: {
                property: 'silverMtZion',
              },
              messageId: 'convertToKebabCase',
              output: `{
                "bin": {
                    "silver-mt-zion": "silver-mt-zion.js",
                    "NIN": "./nin.js"
                }
            }`,
            },
          ],
        },
        {
          data: {
            property: 'NIN',
          },
          line: 4,
          messageId: 'invalidCase',
          suggestions: [
            {
              data: {
                property: 'NIN',
              },
              messageId: 'convertToKebabCase',
              output: `{
                "bin": {
                    "silverMtZion": "silver-mt-zion.js",
                    "nin": "./nin.js"
                }
            }`,
            },
          ],
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "bin": "./silver-mt-zion.js" }`,
    `{ "bin": "silver-mt-zion.js" }`,
    `{ "bin": { "silver-mt-zion": "./silver-mt-zion.js" } }`,
    `{ "bin": { "silver-mt-zion": "silver-mt-zion.js", "nin": "./nin.js" } }`,
  ],
});
