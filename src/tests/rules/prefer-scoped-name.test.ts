import { rule } from '../../rules/prefer-scoped-name.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('prefer-scoped-name', rule, {
  invalid: [
    {
      code: "{ \"name\": \"pkg\" }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"name":"pkg","preferred":"@team"},
          line: 1,
          messageId: 'missingPreferredScope',
          suggestions: [
            {
              messageId: 'usePreferredScopeSuggestion',
              output: "{ \"name\": \"@team/pkg\" }",
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"pkg\", \"private\": true }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"name":"pkg","preferred":"@team"},
          line: 1,
          messageId: 'missingPreferredScope',
        },
      ],
      output: "{ \"name\": \"@team/pkg\", \"private\": true }",
    },
    {
      code: "{ \"name\": \"@other/pkg\" }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"preferred":"@team","scope":"@other"},
          line: 1,
          messageId: 'usePreferredScope',
          suggestions: [
            {
              messageId: 'usePreferredScopeSuggestion',
              output: "{ \"name\": \"@team/pkg\" }",
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"@other/pkg\", \"private\": true }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"preferred":"@team","scope":"@other"},
          line: 1,
          messageId: 'usePreferredScope',
        },
      ],
      output: "{ \"name\": \"@team/pkg\", \"private\": true }",
    },
    {
      code: "{ \"name\": \"@other/pkg\" }",
      options: [{"allowed":["@team"]}],
      errors: [
        {
          column: 11,
          data: {"preferred":"","scope":"@other"},
          line: 1,
          messageId: 'useAllowedScope',
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"@other/pkg\", \"private\": true }",
      options: [{"allowed":["@team"]}],
      errors: [
        {
          column: 11,
          data: {"preferred":"","scope":"@other"},
          line: 1,
          messageId: 'useAllowedScope',
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"@other/pkg\" }",
      options: [{"preferred":"@team","allowed":["@partner"]}],
      errors: [
        {
          column: 11,
          data: {"preferred":"@team","scope":"@other"},
          line: 1,
          messageId: 'usePreferredScope',
          suggestions: [
            {
              messageId: 'usePreferredScopeSuggestion',
              output: "{ \"name\": \"@team/pkg\" }",
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"@other/pkg\", \"private\": false }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"preferred":"@team","scope":"@other"},
          line: 1,
          messageId: 'usePreferredScope',
          suggestions: [
            {
              messageId: 'usePreferredScopeSuggestion',
              output: "{ \"name\": \"@team/pkg\", \"private\": false }",
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: "{ \"name\": \"@other/pkg\", \"private\": \"true\" }",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"preferred":"@team","scope":"@other"},
          line: 1,
          messageId: 'usePreferredScope',
          suggestions: [
            {
              messageId: 'usePreferredScopeSuggestion',
              output: "{ \"name\": \"@team/pkg\", \"private\": \"true\" }",
            },
          ],
        },
      ],
      output: null,
    },
    {
      code: "{\n  \"name\": \"pkg\",\n  \"private\": true\n}",
      options: [{"preferred":"@team"}],
      errors: [
        {
          column: 11,
          data: {"name":"pkg","preferred":"@team"},
          line: 2,
          messageId: 'missingPreferredScope',
        },
      ],
      output: "{\n  \"name\": \"@team/pkg\",\n  \"private\": true\n}",
    },
  ],
  valid: [
    {
      code: "{}",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"meta\": { \"name\": \"pkg\" } }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": [\"pkg\"] }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": null }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": 123 }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": true }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": \"@team/pkg\" }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": \"@partner/pkg\" }",
      options: [{"preferred":"@team","allowed":["@partner"]}],
    },
    {
      code: "{ \"name\": \"@team/pkg\" }",
      options: [{"allowed":["@team"]}],
    },
    {
      code: "{ \"name\": \"pkg\" }",
      options: [{"allowed":["@team"]}],
    },
    {
      code: "{ \"name\": \"@other/pkg\" }",
      options: [{}],
    },
    {
      code: "{ \"name\": \"pkg\" }",
      options: [{}],
    },
    {
      code: "{ \"name\": \"pkg\" }",
    },
    {
      code: "{ \"name\": \"@broken\" }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"private\": true, \"metadata\": { \"name\": \"pkg\" } }",
      options: [{"preferred":"@team"}],
    },
    {
      code: "{ \"name\": \"@other/pkg\" }",
      options: [{"preferred":"@team","allowed":["@other"]}],
    },
  ],
});
