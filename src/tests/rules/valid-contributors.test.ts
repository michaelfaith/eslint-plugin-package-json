import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-contributors', rules['valid-contributors'], {
  invalid: [
    {
      code: `{
	"contributors": null
}
`,
      errors: [
        {
          data: {
            error:
              'the type should be an `Array` of objects with at least a `name` property, and optionally `email` and `url`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"contributors": 123
}
`,
      errors: [
        {
          data: {
            error:
              'the type should be an `Array` of objects with at least a `name` property, and optionally `email` and `url`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"contributors": "./script.js"
}
`,
      errors: [
        {
          data: {
            error:
              'the type should be an `Array` of objects with at least a `name` property, and optionally `email` and `url`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"contributors": {}
}
`,
      errors: [
        {
          data: {
            error:
              'the type should be an `Array` of objects with at least a `name` property, and optionally `email` and `url`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"contributors": [
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
            error:
              'item 0 is invalid; it should be a person object with at least a `name`',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item 1 is invalid; it should be a person object with at least a `name`',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item 2 is invalid; it should be a person object with at least a `name`',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item 3 is invalid; it should be a person object with at least a `name`',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item 4 is invalid; it should be a person object with at least a `name`',
          },
          line: 7,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
    "contributors": [
      {
        "name": "",
        "email": "barney",
        "url": "rubble"
      },
      {
        "name": "fred",
        "email": "flintstone",
        "web": ".com"
      }
    ]
}
`,
      errors: [
        {
          data: {
            error: 'name should not be empty',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'email is not valid: barney',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'url is not valid: rubble',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'email is not valid: flintstone',
          },
          line: 10,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'url is not valid: .com',
          },
          line: 11,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "contributors": [] }`,
    `{ "contributors": [
           {
             "name": "Fred Flintston",
             "email": "f@flintstone.com",
             "web": "https://flintstone.com"
           }
        ] }`,
  ],
});
