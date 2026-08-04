import { rule } from '../../rules/scripts-name-casing.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('scripts-name-casing', rule, {
  invalid: [
    {
      code: `{
  "scripts": {
    "silverMtZion": "silver-mt-zion.js",
    "NIN": "./nin.js",
    ".GodspeedYouBlackEmperor": "./gybe.js",
    ".alt.j": "./alt-j.js"
  }
}`,
      errors: [
        {
          column: 5,
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
  "scripts": {
    "silver-mt-zion": "silver-mt-zion.js",
    "NIN": "./nin.js",
    ".GodspeedYouBlackEmperor": "./gybe.js",
    ".alt.j": "./alt-j.js"
  }
}`,
            },
          ],
        },
        {
          column: 5,
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
  "scripts": {
    "silverMtZion": "silver-mt-zion.js",
    "nin": "./nin.js",
    ".GodspeedYouBlackEmperor": "./gybe.js",
    ".alt.j": "./alt-j.js"
  }
}`,
            },
          ],
        },
        {
          column: 5,
          data: {
            property: '.GodspeedYouBlackEmperor',
          },
          line: 5,
          messageId: 'invalidCase',
          suggestions: [
            {
              data: {
                property: '.GodspeedYouBlackEmperor',
              },
              messageId: 'convertToKebabCase',
              output: `{
  "scripts": {
    "silverMtZion": "silver-mt-zion.js",
    "NIN": "./nin.js",
    ".godspeed-you-black-emperor": "./gybe.js",
    ".alt.j": "./alt-j.js"
  }
}`,
            },
          ],
        },
        {
          column: 5,
          data: {
            property: '.alt.j',
          },
          line: 6,
          messageId: 'invalidCase',
          suggestions: [
            {
              data: {
                property: '.alt.j',
              },
              messageId: 'convertToKebabCase',
              output: `{
  "scripts": {
    "silverMtZion": "silver-mt-zion.js",
    "NIN": "./nin.js",
    ".GodspeedYouBlackEmperor": "./gybe.js",
    ".alt-j": "./alt-j.js"
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
    `{ "scripts": "./silver-mt-zion.js" }`,
    `{ "scripts": "silver-mt-zion.js" }`,
    `{ "scripts": { "silver-mt-zion": "./silver-mt-zion.js" } }`,
    `{ "scripts": { "silver-mt-zion": "silver-mt-zion.js", "nin": "./nin.js" } }`,
    `{ "scripts": { "silver-mt-zion": "silver-mt-zion.js", "godspeed-you:black-emperor": "./gybe.js", "n:i:n": "./nin.js" } }`,
    `{ "scripts": { "prepublishOnly": "npm run build" } }`,
    `{ "scripts": { "pnpm:devPreinstall": "node preinstall.mjs" } }`,
    `{ "scripts": { ".silver-mt-zion": "silver-mt-zion.js", "nin": "./nin.js" } }`,
  ],
});
