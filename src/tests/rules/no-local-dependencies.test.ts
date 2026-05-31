import { rule } from '../../rules/no-local-dependencies.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('no-local-dependencies', rule, {
  invalid: [
    {
      code: `{
  "dependencies": {
    "abc": "file:../file-dependency",
    "def": "./relative-file-dependency",
    "ghi": ".\\\\relative-windows-file-dependency",
    "jkl": "..\\\\relative-parent-windows-file-dependency",
    "mno": "../relative-parent-file-dependency",
    "pqr": "link:../linked-file-dependency"
  }
}`,
      errors: [
        {
          column: 12,
          data: {
            name: 'file:../file-dependency',
          },
          line: 3,
          messageId: 'localDependencyFound',
        },
        {
          column: 12,
          data: {
            name: './relative-file-dependency',
          },
          line: 4,
          messageId: 'localDependencyFound',
        },
        {
          column: 12,
          data: {
            name: '.\\relative-windows-file-dependency',
          },
          line: 5,
          messageId: 'localDependencyFound',
        },
        {
          column: 12,
          data: {
            name: '..\\relative-parent-windows-file-dependency',
          },
          line: 6,
          messageId: 'localDependencyFound',
        },
        {
          column: 12,
          data: {
            name: '../relative-parent-file-dependency',
          },
          line: 7,
          messageId: 'localDependencyFound',
        },
        {
          column: 12,
          data: {
            name: 'link:../linked-file-dependency',
          },
          line: 8,
          messageId: 'localDependencyFound',
        },
      ],
      filename: 'package.json',
    },
    {
      code: `{
  "private": true,
  "dependencies": {
    "abc": "../abc"
  }
}`,
      errors: [
        {
          column: 12,
          data: {
            name: '../abc',
          },
          line: 4,
          messageId: 'localDependencyFound',
        },
      ],
      options: [{ ignorePrivate: false }],
    },
    {
      code: `{
  "private": false,
  "dependencies": {
    "abc": "../abc"
  }
}`,
      errors: [
        {
          column: 12,
          data: {
            name: '../abc',
          },
          line: 4,
          messageId: 'localDependencyFound',
        },
      ],
    },
  ],

  valid: [
    `{}`,
    `{
	"dependencies": {}
}`,
    `{
	"dependencies": {
		"abc": "1.2.3"
	}
}`,
    `{
	"dependencies": {
		"abc": "workspace:^"
	}
}`,
    `{
	"dependencies": {
		"abc": "catalog:"
	}
}`,
    `{
	"devDependencies": {
		"abc": "file:../file-dependency"
	}
}`,
    `{
  "private": true,
	"dependencies": {
		"abc": "../abc"
	}
}`,
  ],
});
