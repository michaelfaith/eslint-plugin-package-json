import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

const ruleName = 'valid-author';

ruleTester.run(ruleName, rules[ruleName], {
  invalid: [
    {
      code: `{
  "author": null
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": 123
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": true
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": []
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": ""
}`,
      errors: [
        {
          data: {
            error: 'person should have a name',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": "   "
}`,
      errors: [
        {
          data: {
            error: 'person should have a name',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": "John <invalid>"
}`,
      errors: [
        {
          data: {
            error: 'email is not valid: invalid',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": "John (not-url)"
}`,
      errors: [
        {
          data: {
            error: 'url is not valid: not-url',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": "<john@example.com>"
}`,
      errors: [
        {
          data: {
            error: 'person should have a name',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {}
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {
    "email": "john@example.com"
  }
}`,
      errors: [
        {
          data: {
            error:
              'the type should be a `string` or an `object` with at least a `name` property',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {
    "name": ""
  }
}`,
      errors: [
        {
          data: {
            error: 'name should not be empty',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {
    "name": "    "
  }
}`,
      errors: [
        {
          data: {
            error: 'name should not be empty',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {
    "name": "John",
    "email": "invalid"
  }
}`,
      errors: [
        {
          data: {
            error: 'email is not valid: invalid',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": {
    "name": "John",
    "url": "invalid"
  }
}`,
      errors: [
        {
          data: {
            error: 'url is not valid: invalid',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "author": "John <invalid-email> (invalid-url)"
}`,
      errors: [
        {
          data: {
            error: 'email is not valid: invalid-email',
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'url is not valid: invalid-url',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
      filename: 'package.json',
    },
  ],

  valid: [
    {
      code: `{}`,
      filename: 'package.json',
    },
    {
      code: `{ "author": "John Doe" }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": "John <john@example.com>" }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": "John (https://example.com)" }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": "John <john@example.com> (https://example.com)" }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": { "name": "John" } }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": { "name": "John", "email": "john@example.com" } }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": { "name": "John", "url": "https://example.com" } }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": { "name": "John", "email": "john@example.com", "url": "https://example.com" } }`,
      filename: 'package.json',
    },
    {
      code: `{ "author": null }`,
      filename: 'not-a-package.json',
    },
  ],
});
