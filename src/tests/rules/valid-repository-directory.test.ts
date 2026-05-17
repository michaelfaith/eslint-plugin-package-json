import path from 'node:path';

import { rule } from '../../rules/valid-repository-directory.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('valid-repository-directory (no repository)', rule, {
  invalid: [
    {
      code: `{
	"repository": {
		"directory": "nonexistent"
	}
}
`,
      errors: [
        {
          column: 16,
          endColumn: 29,
          line: 3,
          messageId: 'mismatched',
          suggestions: [],
        },
      ],
      filename: '/Users/face/src/package.json',
      name: `invalid directory`,
    },
    {
      code: `{
    "repository": {
        "directory": "book"
    }
}
`,
      errors: [
        {
          column: 22,
          endColumn: 28,
          line: 3,
          messageId: 'mismatched',
          suggestions: [],
        },
      ],
      filename: '/Users/face/bookkeeper/package.json',
      name: `don't match on path substring`,
    },
    {
      code: `{
    "repository": {
        "directory": "src"
    }
}
`,
      errors: [
        {
          column: 22,
          endColumn: 27,
          line: 3,
          messageId: 'mismatched',
          suggestions: [],
        },
      ],
      filename: '/Users/face/src/project/package.json',
      name: `path is valid, but not end of path`,
    },
  ],
  valid: [
    `{}`,
    `{ "repository": "" }`,
    `{ "repository": "michaelfaith/eslint-plugin-package-json" }`,
    `{ "repository": "https://github.com/michaelfaith/eslint-plugin-package-json" }`,
    `{ "repository": { "directory": null } }`,
    `{ "repository": { "directory": {} } }`,
    `{
	"repository": {
		"directory": 123
	}
}
`,
    {
      code: `{
    "repository": {
        "directory": "project"
    }
}
`,
      filename: '/Users/face/src/project/package.json',
    },
    {
      code: `{
	"repository": {
		"directory": "deeply/nested"
	}
}
`,
      filename: '/Users/face/src/deeply/nested/package.json',
    },
    {
      code: `{ "repository": { "directory": "/Users/face/src/project" } }`,
      filename: `/Users/face/src/project/package.json`,
      name: `full, absolute path to package.json`,
    },
  ],
});

const thisRepoDirectory = path.resolve(import.meta.dirname, '..', '..', '..');
ruleTester.run('valid-repository-directory (this repository)', rule, {
  invalid: [
    {
      code: `{
	"repository": {
		"directory": "nonexistent"
	}
}
`,
      errors: [
        {
          column: 16,
          endColumn: 29,
          line: 3,
          messageId: 'mismatched',
          suggestions: [
            {
              data: { expected: '' },
              messageId: 'replace',
              output: `{
	"repository": {
		"directory": ""
	}
}
`,
            },
          ],
        },
      ],
      filename: path.resolve(thisRepoDirectory, './package.json'),
      name: `root package.json`,
    },
    {
      code: `{
	"repository": {
		"directory": "nonexistent"
	}
}
`,
      errors: [
        {
          column: 16,
          endColumn: 29,
          line: 3,
          messageId: 'mismatched',
          suggestions: [
            {
              data: {
                expected: 'src/tests/__fixtures__/valid-local-dependency',
              },
              messageId: 'replace',
              output: `{
	"repository": {
		"directory": "src/tests/__fixtures__/valid-local-dependency"
	}
}
`,
            },
          ],
        },
      ],
      filename: path.resolve(
        thisRepoDirectory,
        './src/tests/__fixtures__/valid-local-dependency/package.json',
      ),
      name: `nested package.json`,
    },
  ],
  valid: [
    {
      code: `{ "repository": { "directory": "" } }`,
      filename: `${thisRepoDirectory}/package.json`,

      name: `root package.json`,
    },
    {
      code: `{ "repository": { "directory": "src/tests/__fixtures__/valid-local-dependency" } }`,
      filename: path.resolve(
        thisRepoDirectory,
        './src/tests/__fixtures__/valid-local-dependency/package.json',
      ),
      name: `nested package.json`,
    },
  ],
});
