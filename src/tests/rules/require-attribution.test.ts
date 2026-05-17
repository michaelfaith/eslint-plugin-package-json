import { rule } from '../../rules/require-attribution.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('require-attribution', rule, {
  invalid: [
    {
      code: '{}',
      errors: [
        {
          column: 1,
          endColumn: undefined,
          line: 1,
          messageId: 'missing',
        },
      ],
      name: 'neither',
    },
    {
      code: '{}',
      errors: [
        {
          column: 1,
          endColumn: undefined,
          line: 1,
          messageId: 'missingContributor',
        },
      ],
      name: 'neither (preferContributorsOnly: true)',
      options: [{ preferContributorsOnly: true }],
    },
    {
      code: `{
	"contributors": null
}
`,
      errors: [
        {
          line: 2,
          messageId: 'noContributors',
        },
      ],
    },
    {
      code: `{
    "author": "Trent Reznor",
	"contributors": null
}
`,
      errors: [
        {
          line: 3,
          messageId: 'noContributors',
        },
      ],
    },
    {
      code: `{
\t\t"author": "Trent Reznor",
	"contributors": [
        {
            "name": "Atticus Ross",
            "email": "atticus@nin.com",
            "web": "https://nin.com"
        }
    ]
}
`,
      errors: [
        {
          line: 2,
          messageId: 'contributorsOnly',
          suggestions: [
            {
              messageId: 'removeAuthor',
              output: `{
\t\t
	"contributors": [
        {
            "name": "Atticus Ross",
            "email": "atticus@nin.com",
            "web": "https://nin.com"
        }
    ]
}
`,
            },
          ],
        },
      ],
      name: 'author and contributors (preferContributorsOnly: true)',
      options: [{ preferContributorsOnly: true }],
    },
    {
      code: `{
    "private": false
}`,
      errors: [
        {
          column: 1,
          endColumn: undefined,
          line: 1,
          messageId: 'missing',
        },
      ],
      name: 'missing attribution with private: false (ignorePrivate: true)',
      options: [{ ignorePrivate: true }],
    },
  ],
  valid: [
    `{
    "contributors": [
        {
            "name": "Trent Reznor",
            "email": "treznor@nin.com",
            "web": "https://nin.com"
        },
        {
            "name": "Atticus Ross",
            "email": "atticus@nin.com",
            "web": "https://nin.com"
        }
    ]
}`,
    `{
    "author": "Trent Reznor",
    "contributors": [
        {
            "name": "Trent Reznor",
            "email": "treznor@nin.com",
            "web": "https://nin.com"
        },
        {
            "name": "Atticus Ross",
            "email": "atticus@nin.com",
            "web": "https://nin.com"
        }
    ]
}`,

    {
      code: `{
    "name": "package-with-no-attribution",
    "private": true,
}`,
      name: 'private package without attribution',
    },
    {
      code: `{
    "contributors": [
        {
            "name": "Trent Reznor",
            "email": "treznor@nin.com",
            "web": "https://nin.com"
        },
        {
            "name": "Atticus Ross",
            "email": "atticus@nin.com",
            "web": "https://nin.com"
        }
    ]
}`,
      name: 'contributors only (preferContributorsOnly: true)',
      options: [{ preferContributorsOnly: true }],
    },
    `{
    "author": "Trent Reznor"
}`,
    {
      code: `{
    "private": true
}`,
      name: 'private package without attribution (ignorePrivate: true)',
      options: [{ ignorePrivate: true }],
    },
    {
      code: `{
    "private": true,
    "author": "Trent Reznor"
}`,
      name: 'private package with author (ignorePrivate: true)',
      options: [{ ignorePrivate: true }],
    },
    {
      code: `{
    "private": false,
    "author": "Trent Reznor"
}`,
      name: 'private package with author (ignorePrivate: false)',
      options: [{ ignorePrivate: false }],
    },
  ],
});
