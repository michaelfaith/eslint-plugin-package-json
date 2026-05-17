import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-devEngines', rules['valid-devEngines'], {
  invalid: [
    {
      code: `{
	"devEngines": null
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
	"devEngines": 123
}
`,
      errors: [
        {
          data: {
            error: 'the value should be an `object`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"devEngines": []
}
`,
      errors: [
        {
          data: {
            error: 'the value should be an `object`, not `Array`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"devEngines": "invalid"
}
`,
      errors: [
        {
          data: {
            error: 'the value should be an `object`, not `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"devEngines": {
      "cpu": null,
      "packageManager": "Please use pnpm",
      "runtime": 123
    }
}
`,
      errors: [
        {
          data: {
            error:
              'the value is `null`, but should be an object with at least `name` and optionally `version` and `onFail`',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value should be an object with at least `name` and optionally `version` and `onFail`, not `string`',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the value should be an object with at least `name` and optionally `version` and `onFail`, not `number`',
          },
          line: 5,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"devEngines": {
      "invalid": "invalid-key"
    }
}
`,
      errors: [
        {
          data: {
            error:
              'unexpected property `invalid`; only the following properties are allowed: cpu, libc, os, packageManager, runtime',
          },
          line: 3,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"devEngines": {
      "cpu": {
        "name": "",
        "onFail": "invalid"
      },
      "packageManager": {
        "version": 123,
        "onFail": "error"
      },
      "runtime": {
        "name": null
      }
    }
}
`,
      errors: [
        {
          data: {
            error: 'the `name` property should not be empty',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the `onFail` property should be one of the following values: warn, error, ignore, download',
          },
          line: 5,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'missing required property `name` in devEngine object',
          },
          line: 7,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'the `version` property should be a string, but got `number`',
          },
          line: 8,
          messageId: 'validationError',
        },
        {
          data: {
            error: 'the `name` property should be a string, but got `null`',
          },
          line: 12,
          messageId: 'validationError',
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "devEngines": { "cpu": [], "libc": [], "os": [], "packageManager": [], "runtime": [] } }`,
    `{
	"devEngines": {
      "cpu": {
        "name": "x64",
        "onFail": "warn"
      },
      "packageManager": {
        "name": "pnpm",
        "version": ">=10.0.0",
        "onFail": "error"
      },
      "runtime": {
        "name": "node",
        "version": ">=22.0.0",
        "onFail": "download"
      }
    }
}
`,
    `{
	"devEngines": {
      "cpu": [{
        "name": "x64",
        "onFail": "warn"
      }],
      "packageManager": [{
        "name": "pnpm",
        "version": ">=10.0.0",
        "onFail": "error"
      }],
      "runtime": [{
        "name": "node",
        "version": ">=22.0.0",
        "onFail": "download"
      }]
    }
}
`,
  ],
});
