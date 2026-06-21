import { beforeEach, describe, vi } from 'vitest';

import { rule } from '../../rules/valid-author.ts';
import { getGitAuthor } from '../../utils/git/index.ts';
import { ruleTester } from './ruleTester.ts';

vi.mock('../../utils/git/index.ts', () => ({
  getGitAuthor: vi.fn(),
}));

describe('valid-author', () => {
  describe('with git author returned', () => {
    beforeEach(() => {
      vi.mocked(getGitAuthor).mockReturnValue({
        name: 'michael faith',
        // eslint-disable-next-line perfectionist/sort-objects
        email: 'mfaith@github.com',
      });
    });

    ruleTester.run('valid-author', rule, {
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "john@example.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith"
  }
}`,
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
          output: `{
  "author": {
    "name": "John",
    "email": "mfaith@github.com"
  }
}`,
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
          output: `{
  "author": {
    "name": "michael faith",
    "email": "mfaith@github.com"
  }
}`,
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
  });

  describe('without git author returned', () => {
    beforeEach(() => {
      vi.mocked(getGitAuthor).mockReturnValue(undefined);
    });

    ruleTester.run('valid-author', rule, {
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
  });
});
