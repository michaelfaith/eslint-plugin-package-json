import { rule } from '../../rules/require-package-json-export.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('require-package-json-export', rule, {
  invalid: [
    {
      code: `{
  "exports": "./index.js"
}
`,
      errors: [
        {
          column: 14,
          line: 2,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "publishConfig": {
    "exports": "./index.js"
  }
}
`,
      errors: [
        {
          column: 16,
          line: 3,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "publishConfig": {
    "exports": {
      ".": "./index.js",
      "./package.json": "./package.json"
    }
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
`,
      errors: [
        {
          column: 14,
          line: 2,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    },
    "./package.json": "./package.json"
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "publishConfig": {
    "exports": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    }
  }
}
`,
      errors: [
        {
          column: 16,
          line: 3,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./index.mjs",
        "require": "./index.cjs"
      },
      "./package.json": "./package.json"
    }
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "exports": {
    ".": "./index.mjs"
  }
}
`,
      errors: [
        {
          column: 14,
          line: 2,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "exports": {
    ".": "./index.mjs",
    "./package.json": "./package.json"
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
  "publishConfig": {
    "exports": {
      ".": "./index.mjs"
    }
  }
}
`,
      errors: [
        {
          column: 16,
          line: 3,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
  "publishConfig": {
    "exports": {
      ".": "./index.mjs",
      "./package.json": "./package.json"
    }
  }
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t"publishConfig": {
\t\t"exports": {
\t\t\t".": "./index.mjs"
\t\t}
\t}
}
`,
      errors: [
        {
          column: 14,
          line: 3,
          messageId: 'missing',
          suggestions: [
            {
              messageId: 'addExport',
              output: `{
\t"publishConfig": {
\t\t"exports": {
\t\t\t".": "./index.mjs",
\t\t\t"./package.json": "./package.json"
\t\t}
\t}
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
    `{
	"exports": null
}
`,
    `{
	"publishConfig": null
}
`,
    `{
	"publishConfig": { "exports": null }
}
`,
    `{
	"exports": 123
}
`,
    `{
	"publishConfig": 123
}
`,
    `{
	"publishConfig": { "exports": 123 }
}
`,
  ],
});
