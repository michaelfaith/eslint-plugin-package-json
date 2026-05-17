import { rules } from '../../rules/valid-properties.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-repository', rules['valid-repository'], {
  invalid: [
    {
      code: `{
	"repository": null
}
`,
      errors: [
        {
          data: {
            error:
              'the value is `null`, but should be an `object` or a `string`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"repository": 123
}
`,
      errors: [
        {
          data: {
            error: 'the type should be `object` or `string`, not `number`',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"repository": ""
}
`,
      errors: [
        {
          data: {
            error:
              'the value is empty, but should be repository shorthand string',
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"repository": {
      "type": "git",
      "url": 123
    }
}
`,
      errors: [
        {
          data: {
            error: 'the value of property "url" should be a string',
          },
          line: 4,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"repository": {
      "directory": "packages/lib-a"
    }
}
`,
      errors: [
        {
          data: {
            error: `repository is missing property "type", which should be the type of repository this is (e.g. "git")`,
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error: `repository is missing property "url", which should be the url to a repository (e.g. "git+https://github.com/npm/cli.git")`,
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    },
    {
      code: `{
	"repository": {
        "": "packages/lib-a",
        "  ": "git",
        "    ": "git+https://github.com/michaelfaith/eslint-plugin-package-json.git"
    }
}
`,
      errors: [
        {
          data: {
            error: `repository is missing property "type", which should be the type of repository this is (e.g. "git")`,
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error: `repository is missing property "url", which should be the url to a repository (e.g. "git+https://github.com/npm/cli.git")`,
          },
          line: 2,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 0 is invalid; keys should be "type", "url", and optionally "directory"',
          },
          line: 3,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 1 is invalid; keys should be "type", "url", and optionally "directory"',
          },
          line: 4,
          messageId: 'validationError',
        },
        {
          data: {
            error:
              'property 2 is invalid; keys should be "type", "url", and optionally "directory"',
          },
          line: 5,
          messageId: 'validationError',
        },
      ],
    },
    ...[
      'svn:npm/example',
      'eslint-plugin-package-json',
      'git:npm/example',
      'github:npm/example/repo',
      'org/user/repo',
    ].map((value) => ({
      code: `{
	"repository": "${value}"
}
`,
      errors: [
        {
          data: {
            error: `the value "${value}" is invalid; it should be the shorthand for a repository (e.g. "github:npm/example")`,
          },
          line: 2,
          messageId: 'validationError',
        },
      ],
    })),
  ],
  valid: [
    '{}',
    ...[
      'git+https://github.com/michaelfaith/eslint-plugin-package-json.git',
      'https://github.com/michaelfaith/eslint-plugin-package-json',
      'https://github.com/michaelfaith/eslint-plugin-package-json.git',
      'http://github.com/michaelfaith/eslint-plugin-package-json.git',
      'git://github.com/michaelfaith/eslint-plugin-package-json.git',
      'git://github.com/michaelfaith/eslint-plugin-package-json',
      'git@github.com:michaelfaith/eslint-plugin-package-json.git',
    ].flatMap((value) => [
      {
        code: `{
	"repository": {
      "type": "git",
      "url": "${value}",
      "directory": "packages/a"
    }
}
`,
        name: `${value} (with directory)`,
      },
      {
        code: `{
	"repository": {
      "type": "git",
      "url": "${value}"
    }
}
`,
        name: `${value} (without directory)`,
      },
    ]),
    ...[
      'npm/example',
      'github:npm/example',
      'gist:11081aaa281',
      'bitbucket:user/repo',
      'gitlab:user/repo',
      // Repos with hyphens and dots in names
      'github:some-user/some-repo',
      'github:user-name/repo-name',
      'some-user/some-repo',
      'user-name/repo.js',
      'bitbucket:my-org/my-repo',
      'gitlab:some.user/some.repo',
    ].map((value) => ({
      code: `{
	"repository": "${value}"
}
`,
      name: value,
    })),
  ],
});
