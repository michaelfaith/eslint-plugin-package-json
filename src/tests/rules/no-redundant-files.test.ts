import { rule } from '../../rules/no-redundant-files.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('no-redundant-files', rule, {
  invalid: [
    {
      code: `{
\t"files": [
\t\t"README.md",
\t\t"./package.json"
    ]
}
`,
      errors: [
        {
          data: { file: 'README.md' },
          line: 3,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t
\t\t"./package.json"
    ]
}
`,
            },
          ],
        },
        {
          data: { file: './package.json' },
          line: 4,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t"README.md"
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t"files": [
\t\t"README.a-b-c.md",
\t\t"./package.json"
    ]
}
`,
      errors: [
        {
          data: { file: 'README.a-b-c.md' },
          line: 3,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t
\t\t"./package.json"
    ]
}
`,
            },
          ],
        },
        {
          data: { file: './package.json' },
          line: 4,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t"README.a-b-c.md"
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t"files": [
\t\t"CHANGELOG.md",
\t\t"dist",
\t\t"CHANGELOG.md"
    ]
}
`,
      errors: [
        {
          data: { file: 'CHANGELOG.md' },
          line: 5,
          messageId: 'duplicate',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t"CHANGELOG.md",
\t\t"dist"
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
    "main": "./index.js",
\t"files": [
\t\t"CHANGELOG.md",
\t\t"./index.js"
    ]
}
`,
      errors: [
        {
          data: { file: './index.js' },
          line: 5,
          messageId: 'unnecessaryMain',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
    "main": "./index.js",
\t"files": [
\t\t"CHANGELOG.md"
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
    "main": "./index.js",
\t"files": [
\t\t"CHANGELOG.md",
\t\t"index.js"
    ]
}
`,
      errors: [
        {
          data: { file: 'index.js' },
          line: 5,
          messageId: 'unnecessaryMain',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
    "main": "./index.js",
\t"files": [
\t\t"CHANGELOG.md"
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "bin": "./dist/cli.js",
\t"files": [
\t\t"CHANGELOG.md",
\t\t"./dist/cli.js"
  ]
}
`,
      errors: [
        {
          data: { file: './dist/cli.js' },
          line: 5,
          messageId: 'unnecessaryBin',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
  "bin": "./dist/cli.js",
\t"files": [
\t\t"CHANGELOG.md"
\t\t
  ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "bin": "./dist/cli.js",
\t"files": [
\t\t"CHANGELOG.md",
\t\t"dist/cli.js"
  ]
}
`,
      errors: [
        {
          data: { file: 'dist/cli.js' },
          line: 5,
          messageId: 'unnecessaryBin',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
  "bin": "./dist/cli.js",
\t"files": [
\t\t"CHANGELOG.md"
\t\t
  ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "bin": {
    "cli": "./dist/cli.js",
  },
\t"files": [
\t\t"CHANGELOG.md",
\t\t"./dist/cli.js"
  ]
}
`,
      errors: [
        {
          data: { file: './dist/cli.js' },
          line: 7,
          messageId: 'unnecessaryBin',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
  "bin": {
    "cli": "./dist/cli.js",
  },
\t"files": [
\t\t"CHANGELOG.md"
\t\t
  ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "bin": {
    "cli": "./dist/cli.js",
  },
\t"files": [
\t\tnull,
\t\t"CHANGELOG.md",
\t\t"./dist/cli.js"
  ]
}
`,
      errors: [
        {
          data: { file: './dist/cli.js' },
          line: 8,
          messageId: 'unnecessaryBin',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
  "bin": {
    "cli": "./dist/cli.js",
  },
\t"files": [
\t\tnull,
\t\t"CHANGELOG.md"
\t\t
  ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t"files": [
\t\t"README.md",
\t\tnull,
\t\t"./package.json"
    ]
}
`,
      errors: [
        {
          data: { file: 'README.md' },
          line: 3,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t
\t\tnull,
\t\t"./package.json"
    ]
}
`,
            },
          ],
        },
        {
          data: { file: './package.json' },
          line: 5,
          messageId: 'unnecessaryDefault',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t"files": [
\t\t"README.md",
\t\tnull
\t\t
    ]
}
`,
            },
          ],
        },
      ],
    },
  ],
  valid: [
    '{}',
    `{ "main": "./index.js" }`,
    `{ "bin": "./bin/cli.js" }`,
    `{ "bin": {
  "cli": "./bin/cli.js"
}}`,
    `{ "main": "./dist/index.js", "files": ["CHANGELOG.md", "dist"] }`,
    `{
		"main": "./index.js",
		"files": [
			"*.d.ts",
			"dist"
		]
	}`,
    `{
		"main": "./lib/index.js",
		"files": [
			"lib/**/*.js",
			"*.d.ts",
		]
	}`,
    `{
		"bin": "./bin/cli.js",
		"files": [
			"bin/*",
			"*.json"
		]
	}`,
    `{
		"files": [
			"src/**/*",
			"*.ts",
			"!src/**/*.test.ts"
		]
	}`,
    `{
		"files": [
			"**/*.d.ts",
			"lib/[abc].js",
			"src/{utils,helpers}/*.js"
		]
	}`,

    `{
		"main": "./index.js",
		"files": [
			"*.d.ts",
			"dist/specific-file.js",
			"lib/**/*"
		]
	}`,
  ],
});
