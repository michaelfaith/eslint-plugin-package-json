import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-funding', rules['valid-funding'], {
  invalid: [
    {
      code: `{
	"funding": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be an object with `type` and `url`, a string, or an Array of the two',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"funding": 123
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be an object with `type` and `url`, a string, or an Array of the two',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"funding": "./script.js"
}
`,
      errors: [
        {
          data: {
            error: 'the value should be a valid URL',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"funding": ""
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be a URL',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"funding": {}
}
`,
      errors: [
        {
          data: {
            error: 'missing required property `type` in funding object',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'missing required property `url` in funding object',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"funding": [
      "string",
      true,
      123,
      {},
      []
    ]
}
`,
      errors: [
        {
          data: {
            error: 'the value should be a valid URL',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value should be an object with `type` and `url` or a string URL',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value should be an object with `type` and `url` or a string URL',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'missing required property `type` in funding object',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'missing required property `url` in funding object',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value should be an object with `type` and `url` or a string URL',
          },
          line: 7,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
    "funding": [
      {
        "email": "some@mail.com",
		"type": "patreon",
		"url": ""
      },
      "invalid",
      {
        "type": "",
		"url": "invalid-url"
      }
    ]
}
`,
      errors: [
        {
          data: {
            error:
              'unexpected property `email`; only `type` and `url` are allowed in a funding object',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the `url` property should not be empty',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value should be a valid URL',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the `type` property should not be empty',
          },
          line: 10,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the `url` property should be a valid URL',
          },
          line: 11,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "funding": [] }`,
    `{ "funding": [
           {
                "type": "patreon",
                "url": "https://patreon.com/treznor"
            }
        ] }`,
    `{ "funding": [
           "https://patreon.com/treznor"
        ] }`,
    `{ "funding": [
           {
                "type": "patreon",
                "url": "https://patreon.com/treznor"
            },
            "https://patreon.com/treznor"
        ] }`,
    `{ "funding": "https://patreon.com/treznor" }`,
  ],
});
