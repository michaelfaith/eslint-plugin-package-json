import { rule } from '../../rules/no-empty-fields.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('no-empty-fields', rule, {
  invalid: [
    {
      code: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"dependencies": {
\t\t\t\t"@altano/repository-tools": "^0.1.1"
\t\t}
}
`,
      errors: [
        {
          data: { field: 'workspaces' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t
\t\t"dependencies": {
\t\t\t\t"@altano/repository-tools": "^0.1.1"
\t\t}
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"config": [ [], ["test"] ]
}
`,
      errors: [
        {
          data: { expressionType: 'array' },
          messageId: 'emptyExpression',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"config": [  ["test"] ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"config": [ {}, ["test"], [] ]
}
`,
      errors: [
        {
          data: { expressionType: 'object' },
          messageId: 'emptyExpression',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"config": [  ["test"], [] ]
}
`,
            },
          ],
        },
        {
          data: { expressionType: 'array' },
          messageId: 'emptyExpression',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"config": [ {}, ["test"]  ]
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"dependencies": {}
}
`,
      errors: [
        {
          data: { field: 'dependencies' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test"
\t\t
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"files": [
\t\t\t\t"index.js"
\t\t],
\t\t"peerDependencies": {}
}
`,
      errors: [
        {
          data: { field: 'peerDependencies' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"files": [
\t\t\t\t"index.js"
\t\t]
\t\t
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"scripts": {}
}
`,
      errors: [
        {
          data: { field: 'scripts' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test"
\t\t
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"devDependencies": {}
}
`,
      errors: [
        {
          data: { field: 'devDependencies' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test"
\t\t
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"peerDependencyMeta": {
\t\t\t\t"@altano/repository-tools": {
\t\t\t\t\t\t"optional": true
\t\t\t\t},
\t\t\t\t"nin": {}
\t\t}
}
`,
      errors: [
        {
          data: { field: 'nin' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"peerDependencyMeta": {
\t\t\t\t"@altano/repository-tools": {
\t\t\t\t\t\t"optional": true
\t\t\t\t}
\t\t\t\t
\t\t}
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"peerDependencyMeta": {
\t\t\t\t"@altano/repository-tools": {
\t\t\t\t\t\t"optional": true
\t\t\t\t},
\t\t\t\t"nin": []
\t\t}
}
`,
      errors: [
        {
          data: { field: 'nin' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"peerDependencyMeta": {
\t\t\t\t"@altano/repository-tools": {
\t\t\t\t\t\t"optional": true
\t\t\t\t}
\t\t\t\t
\t\t}
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"dependencies": {
\t\t\t\t"@altano/repository-tools": "^0.1.1",
\t\t\t\t"test": []
\t\t}
}
`,
      errors: [
        {
          data: { field: 'workspaces' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t
\t\t"dependencies": {
\t\t\t\t"@altano/repository-tools": "^0.1.1",
\t\t\t\t"test": []
\t\t}
}
`,
            },
          ],
        },
        {
          data: { field: 'test' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"dependencies": {
\t\t\t\t"@altano/repository-tools": "^0.1.1"
\t\t\t\t
\t\t}
}
`,
            },
          ],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"browserslist": [],
\t\t"files": [],
\t\t"scripts": {}
}
`,
      errors: [
        {
          data: { field: 'workspaces' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t
\t\t"browserslist": [],
\t\t"files": [],
\t\t"scripts": {}
}
`,
            },
          ],
        },
        {
          data: { field: 'files' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"browserslist": [],
\t\t
\t\t"scripts": {}
}
`,
            },
          ],
        },
        {
          data: { field: 'scripts' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"workspaces": [],
\t\t"browserslist": [],
\t\t"files": []
\t\t
}
`,
            },
          ],
        },
      ],
      options: [
        {
          ignoreProperties: ['browserslist'],
        },
      ],
    },
    {
      code: `{
\t\t"name": "test",
\t\t"browserslist": {
\t\t\t"development": [],
\t\t\t"production": [ "last 1 version", "> 1%", "not dead" ]
\t\t}
}
`,
      errors: [
        {
          data: { field: 'development' },
          messageId: 'emptyFields',
          suggestions: [
            {
              messageId: 'remove',
              output: `{
\t\t"name": "test",
\t\t"browserslist": {
\t\t\t
\t\t\t"production": [ "last 1 version", "> 1%", "not dead" ]
\t\t}
}
`,
            },
          ],
        },
      ],
      options: [
        {
          ignoreProperties: ['development'],
        },
      ],
    },
  ],
  valid: [
    `{}`,
    `[]`,
    `{ "name": "test", "files": [] }`,
    `{ "name": "test", "files": ["index.js"] }`,
    `{ "name": "test", "peerDependencies": { "eslint": ">=8.0.0" } }`,
    `{ "name": "test", "dependencies": { "eslint": ">=8.0.0" } }`,
    `{ "name": "test", "devDependencies": { "eslint": ">=8.0.0" } }`,
    `{ "name": "test", "scripts": { "lint": "eslint --fix ." } }`,
    `{ "name": "test", "peerDependencyMeta": { "@altano/repository-tools": { "optional": true } } }`,
    `{ "name": "test", "peerDependencyMeta": { "@altano/repository-tools": { "optional": true, "test": [{"test": ["1"]}] } } }`,
    `{ "name": "test", "peerDependencyMeta": { "@altano/repository-tools": { "optional": true, "test": ["field1"] } } }`,
    {
      code: `{ "name": "test", "browserslist": [] }`,
      options: [
        {
          ignoreProperties: ['browserslist'],
        },
      ],
    },
    {
      code: `{ "name": "test", "browserslist": { "development": [], "production": [ "last 1 version", "> 1%", "not dead" ] } }`,
      options: [
        {
          ignoreProperties: ['browserslist'],
        },
      ],
    },
  ],
});
