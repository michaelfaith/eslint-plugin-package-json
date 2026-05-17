import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run(
  'valid-optionalDependencies',
  rules['valid-optionalDependencies'],
  {
    invalid: [
      {
        code: `{
	"optionalDependencies": null
}
`,
        errors: [
          {
            data: {
              error:
                'the value is `null`, but should be a record of dependencies',
            },
            line: 2,
            messageId: 'validationError',
          },
        ],
      },
      {
        code: `{
	"optionalDependencies": 123
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
	"optionalDependencies": "./script.js"
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
	"optionalDependencies": []
}
`,
        errors: [
          {
            data: {
              error: 'the type should be `object`, not `array`',
            },
            line: 2,
            messageId: 'validationError',
          },
        ],
      },
      {
        code: `{
	"optionalDependencies": {
        "david": "bowie",
        "trent": 123,
        "the-fragile": null,
        "pink-floyd": {},
        "childish-gambino": "workspace"
    }
}
`,
        errors: [
          {
            column: 18,
            data: {
              error: 'dependency version for `trent` should be a string: 123',
            },
            line: 4,
            messageId: 'validationError',
          },
          {
            column: 24,
            data: {
              error:
                'dependency version for `the-fragile` should be a string: null',
            },
            line: 5,
            messageId: 'validationError',
          },
          {
            column: 23,
            data: {
              error:
                'dependency version for `pink-floyd` should be a string: [object Object]',
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
  "optionalDependencies": {
    "silver-mt-zion": "^1.2.3",
    "nin": "file:./nin",
    "gybe": "catalog:",
    "radiohead": "git+https://github.com/user/repo.git",
    "sigur-ros": "https://example.com/sigur-ros.tgz",
    "explosions-in-the-sky": "workspace:^",
    "alt-j": "workspace:~",
    "run-the-jewels": "workspace:*",
    "thee-silver-mt-zion": "workspace:^1.2.3",
    "efrim-manuel-menuck": "npm:bar@^1.0.0",
    "jessica-moss": "beta"
  }
}`,
      `{ "optionalDependencies": {} }`,
    ],
  },
);
