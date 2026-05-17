import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-bugs', rules['valid-bugs'], {
  invalid: [
    {
      code: `{
	"bugs": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be either a string URL or an object with `email` and / or `url` properties',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": 123
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be either a string URL or an object with `email` and / or `url` properties',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": []
}
`,
      errors: [
        {
          data: {
            error:
              'the value should be either a string URL or an object with `email` and / or `url` properties',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": "invalid"
}
`,
      errors: [
        {
          data: {
            error: 'the value should be a URL',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": {
      "invalid": "some@email.com"
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the object should have at least one of these properties: email, url',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'unexpected property "invalid". Only "email" and "url" are allowed',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": {
      "email": 123,
      "url": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value of `email` should be a string',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value of `url` should be a string',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"bugs": {
      "email": "invalid",
      "url": "invalid"
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value of `email` should be a valid email address',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value of `url` should be a valid URL',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    `{}`,
    `{ "bugs": "https://example.com" }`,
    `{ "bugs": { "email": "some@email.com" } }`,
    `{ "bugs": { "url": "https://example.com" } }`,
    `{ "bugs": { "email": "some@email.com", "url": "https://example.com" } }`,
  ],
});
