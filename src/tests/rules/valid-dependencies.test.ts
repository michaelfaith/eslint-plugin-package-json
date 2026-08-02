import type { RuleTester } from 'eslint';
import { describe, vi } from 'vitest';

import { ruleTester } from './ruleTester.ts';

const mockDetect = vi.fn();
vi.mock('package-manager-detector', () => ({
  detect: mockDetect,
}));

interface TestEnvironment {
  description: string;
  beforeAll: (() => void) | (() => Promise<void>);
  additionalValidTests?: (RuleTester.ValidTestCase | string)[];
  additionalInvalidTests?: RuleTester.InvalidTestCase[];
}

const testEnvironments: TestEnvironment[] = [
  {
    description: 'with pnpm 11.1.0',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'pnpm',
        agent: 'pnpm',
        version: '11.1.0',
      });
    },
    additionalValidTests: [
      `{
  "dependencies": {
    "cst-records": "record-label:foo@^1.2.3"
  }
}
`,
    ],
    additionalInvalidTests: [
      {
        code: `{
  "dependencies": {
    "empty-custom-protocol": "work:",
    "bad-custom-protocol": "work:git+foo://github.com/npm/cli.git"
  }
}
`,
        errors: [
          {
            column: 30,
            data: {
              error:
                'invalid version spec for dependency `empty-custom-protocol`: Unsupported URL Type "work:": work:',
            },
            line: 3,
            messageId: 'validationError',
          },
          {
            column: 28,
            data: {
              error:
                'invalid custom protocol arg for dependency `bad-custom-protocol`: Unsupported URL Type "git+foo:": git+foo://github.com/npm/cli.git',
            },
            line: 4,
            messageId: 'validationError',
          },
        ],
      },
    ],
  },
  {
    description: 'with pnpm 11.0.0',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'pnpm',
        agent: 'pnpm',
        version: '11.0.0',
      });
    },
  },
  {
    description: 'with pnpm 10.0.0',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'pnpm',
        agent: 'pnpm',
        version: '10.0.0',
      });
    },
  },
  {
    description: 'with pnpm, but no version',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'pnpm',
        agent: 'pnpm',
      });
    },
  },
  {
    description: 'with npm',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'npm',
        agent: 'npm',
        version: '11.12.0',
      });
    },
  },
  {
    description: 'with yarn',
    beforeAll: () => {
      mockDetect.mockResolvedValue({
        name: 'yarn',
        agent: 'yarn',
        version: '4.18.0',
      });
    },
  },
  {
    description: 'with no package manager detected',
    beforeAll: () => {
      mockDetect.mockResolvedValue(null);
    },
  },
];

describe.each(testEnvironments)(
  '$description',
  async ({ beforeAll, additionalValidTests, additionalInvalidTests }) => {
    await beforeAll();

    const { rules } = await import('../../rules/valid-properties.ts');
    ruleTester.run('valid-dependencies', rules['valid-dependencies'], {
      invalid: [
        {
          code: `{
	"dependencies": null
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
	"dependencies": 123
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
	"dependencies": "./script.js"
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
	"dependencies": []
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
	"dependencies": {
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
              column: 14,
              data: {
                error: 'dependency version for `trent` should be a string: 123',
              },
              line: 4,
              messageId: 'validationError',
            },
            {
              column: 20,
              data: {
                error:
                  'dependency version for `the-fragile` should be a string: null',
              },
              line: 5,
              messageId: 'validationError',
            },
            {
              column: 19,
              data: {
                error:
                  'dependency version for `pink-floyd` should be a string: [object Object]',
              },
              line: 6,
              messageId: 'validationError',
            },
          ],
        },
        ...(additionalInvalidTests ?? []),
      ],
      valid: [
        '{}',
        `{
  "dependencies": {
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
        `{ "dependencies": {} }`,
        ...(additionalValidTests ?? []),
      ],
    });

    vi.resetModules();
  },
);
