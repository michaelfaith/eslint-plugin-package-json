import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-publishConfig', rules['valid-publishConfig'], {
  invalid: [
    {
      code: `{
	"publishConfig": null
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
	"publishConfig": 123
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
	"publishConfig": "string"
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
	"publishConfig": {
        "access": "not right",
        "bin": "",
        "cpu": ["", "   "],
        "directory": "",
        "exports": {
            "": "./dist/index.js",
            "./secondary": ""
        },
        "main": "",
        "provenance": null,
        "tag": ""
    }
}
`,
      errors: [
        {
          data: {
            error: `the value "not right" is not valid. Valid types are: public, restricted`,
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value is empty, but should be a relative path',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 0 is empty, but should be the name of a CPU architecture',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'item at index 1 is empty, but should be the name of a CPU architecture',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value is empty, but should be the path to a subdirectory',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 0 has an empty key, but should be an export condition',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value of "./secondary" is empty, but should be an entry point path',
          },
          line: 9,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              "the value is empty, but should be the path to the package's main module",
          },
          line: 11,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value is `null`, but should be a `boolean`',
          },
          line: 12,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the value is empty, but should be a release tag',
          },
          line: 13,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"publishConfig": {
        "access": "",
        "bin": 123,
        "cpu": 123,
        "directory": 123,
        "exports": {
            "": 123,
            "./secondary": null
        },
        "main": 123,
        "provenance": 123,
        "tag": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value is empty, but should be "public" or "restricted"',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be `string` or `object`, not `number`',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be `Array`, not `number`',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `string`, not `number`',
          },
          line: 6,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value of property 0 should be either an entry point path or an object of export conditions',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 0 has an empty key, but should be an export condition',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `string`, not `number`',
          },
          line: 11,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `boolean`, not `number`',
          },
          line: 12,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `string`, not `number`',
          },
          line: 13,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"publishConfig": {
        "access": [],
        "directory": [],
        "provenance": [],
        "tag": []
    }
}
`,
      errors: [
        {
          data: {
            error: 'the type should be a `string`, not `Array`',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `string`, not `Array`',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `boolean`, not `Array`',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the type should be a `string`, not `Array`',
          },
          line: 6,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{
    "publishConfig": {
        "access": "restricted",
        "bin": "./bin/cli.js",
        "cpu": ["arm64", "x64"],
        "directory": "dist",
        "exports": {
            ".": "./dist/index.js",
            "./secondary": "./dist/secondary.js"
        },
        "main": "./dist/index.js",
        "provenance": true,
        "tag": "dev"
    }
}`,
    `{
    "publishConfig": {
        "access": null,
        "cpu": [],
        "exports": "./dist/index.js"
    }
}`,
  ],
});
