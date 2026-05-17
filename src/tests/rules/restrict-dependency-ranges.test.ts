import { rule } from '../../rules/restrict-dependency-ranges.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('restrict-dependency-ranges', rule, {
  invalid: [
    // rangeType: 'caret'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
      errors: [
        {
          data: {
            rangeTypes: 'caret',
          },
          line: 4,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToCaret',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "^1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'caret',
          },
          line: 5,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToCaret',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "^1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'caret',
          },
          line: 6,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToCaret',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:^",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'caret',
          },
          line: 8,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToCaret',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:^",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'caret',
          },
          line: 9,
          messageId: 'wrongRangeType',
        },
      ],
      filename: 'package.json',
      name: `rangeType: 'caret'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'caret' }],
    })),

    // rangeType: 'pin'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
      errors: [
        {
          data: {
            rangeTypes: 'pin',
          },
          line: 3,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToPin',
              output: `{
    "${dependencyType}": {
        "abc": "1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'pin',
          },
          line: 5,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToPin',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'pin',
          },
          line: 7,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToPin',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:*",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'pin',
          },
          line: 8,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToPin',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:*",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'pin',
          },
          line: 9,
          messageId: 'wrongRangeType',
        },
      ],
      filename: 'package.json',
      name: `rangeType: 'pin'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'pin' }],
    })),

    // rangeType: 'tilde'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
      errors: [
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 3,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
    "${dependencyType}": {
        "abc": "~1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 4,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "~1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 6,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:~",
        "mno": "workspace:^",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 7,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
    "${dependencyType}": {
        "abc": "^1.2.3",
        "def": "1.2.3",
        "ghi": "~1.2.3",
        "jkl": "workspace:*",
        "mno": "workspace:~",
        "pqr": "workspace:~",
        "stu": "*"
    }
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 9,
          messageId: 'wrongRangeType',
        },
      ],
      filename: 'package.json',
      name: `rangeType: 'tilde'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'tilde' }],
    })),

    // multiple options (last wins)
    {
      code: `{
	"dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:*",
        "jkl": "1.2.3"
	}
}`,
      errors: [
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 5,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
	"dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:~",
        "jkl": "1.2.3"
	}
}`,
            },
          ],
        },
        {
          data: {
            rangeTypes: 'tilde',
          },
          line: 6,
          messageId: 'wrongRangeType',
          suggestions: [
            {
              messageId: 'changeToTilde',
              output: `{
	"dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:*",
        "jkl": "~1.2.3"
	}
}`,
            },
          ],
        },
      ],
      filename: 'package.json',
      name: `[{ rangeType: 'pin' }, { rangeType: 'tilde' }]`,
      options: [[{ rangeType: 'pin' }, { rangeType: 'tilde' }]],
    },
  ],

  valid: [
    {
      code: `{
	"dependencies": {
		"abc": "^1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:*"
	}
}`,
      name: 'no options',
    },
    {
      code: '{}',
      name: 'empty package.json',
      options: [{ rangeType: 'caret' }],
    },
    {
      code: `{
    "dependencies": {
        "abc": "catalog:",
        "def": "user/repo",
        "ghi": "file:../foo/bar",
        "jkl": "git+https://user@github.com/user/repo.git"
    }
}`,
      name: 'ignored version formats',
      options: [{ rangeType: 'caret' }],
    },
    {
      code: `{
    "notDependencies": {
        "abc": "*"
    }
}`,
      name: 'no dependencies',
      options: [{ rangeType: 'caret' }],
    },
    {
      code: `{
    "dependencies": {
        "abc": {
            "version": "1.2.3",
            "resolved": "https://registry.npmjs.org/abc/-/abc-1.2.3.tgz",
            "integrity": "sha512-abc"
        },
        "def": 123,
        "ghi": true,
        "jkl": null,
        123: "~1.2.3",
    }
}`,
      name: 'malformed dependencies',
      options: [{ rangeType: 'caret' }],
    },

    // rangeType: 'caret'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {}
}`,
      name: `rangeType: 'caret'; dependencyType: '${dependencyType}'; no deps`,
      options: [{ rangeType: 'caret' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "^1.2.3",
        "def": "workspace:^1.2.3",
        "ghi": "workspace:^"
	}
}`,
      name: `rangeType: 'caret'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'caret' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "^1.2.3",
        "def": "workspace:^1.2.3",
        "ghi": "workspace:^"
	}
}`,
      name: `rangeType: ['caret']; dependencyType: '${dependencyType}'`,
      options: [[{ rangeType: ['caret'] }]],
    })),

    // rangeType: 'pin'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {}
}`,
      name: `rangeType: 'pin'; dependencyType: '${dependencyType}'; no deps`,
      options: [{ rangeType: 'pin' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "1.2.3",
        "def": "workspace:*"
	}
}`,
      name: `rangeType: 'pin'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'pin' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "1.2.3",
        "def": "workspace:*"
	}
}`,
      name: `rangeType: ['pin']; dependencyType: '${dependencyType}'`,
      options: [[{ rangeType: ['pin'] }]],
    })),

    // rangeType: 'tilde'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {}
}`,
      name: `rangeType: 'tilde'; dependencyType: '${dependencyType}'; no deps`,
      options: [{ rangeType: 'tilde' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:~"
	}
}`,
      name: `rangeType: 'tilde'; dependencyType: '${dependencyType}'`,
      options: [{ rangeType: 'tilde' }],
    })),
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:~"
	}
}`,
      name: `rangeType: ['tilde']; dependencyType: '${dependencyType}'`,
      options: [[{ rangeType: ['tilde'] }]],
    })),

    // rangeType: 'pin' and 'tilde'
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:~",
        "jkl": "1.2.3",
        "mno": "workspace:*"
	}
}`,
      name: `rangeType: ['pin', 'tilde']; dependencyType: '${dependencyType}'`,
      options: [[{ rangeType: ['pin', 'tilde'] }]],
    })),

    // forDependencyTypes: devDependencies
    {
      code: `{
    "dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:1.2.3",
        "ghi": "workspace:*"
	},
	"devDependencies": {
		"abc": "^1.2.3",
        "def": "workspace:^1.2.3",
        "ghi": "workspace:^"
	}
}`,
      name: "forDependencyTypes: 'devDependencies'",
      options: [
        { forDependencyTypes: ['devDependencies'], rangeType: 'caret' },
      ],
    },

    // forPackages: abc
    {
      code: `{
    "dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:1.2.3",
        "ghi": "workspace:*"
	},
	"devDependencies": {
		"abc": "~1.2.3",
        "def": "workspace:^1.2.3",
        "ghi": "workspace:^"
	}
}`,
      name: "forPackages: 'abc'",
      options: [{ forPackages: ['abc'], rangeType: 'tilde' }],
    },

    // forPackages: ^a.+
    {
      code: `{
    "dependencies": {
		"abc": "~1.2.3",
        "def": "workspace:1.2.3",
        "ghi": "workspace:*"
	},
	"devDependencies": {
		"abc": "~1.2.3",
        "def": "workspace:^1.2.3",
        "ghi": "workspace:^"
	}
}`,
      name: "forPackages: '^a.+'",
      options: [{ forPackages: ['^a.+'], rangeType: 'tilde' }],
    },

    // forVersions: <1
    {
      code: `{
    "dependencies": {
		"abc": "~1.2.3",
        "def": "0.1.2",
        "ghi": "workspace:^"
	},
	"devDependencies": {
		"abc": "1.2.3",
        "def": "0.1.2",
        "ghi": "workspace:^"
	}
}`,
      name: "forVersions: '<1'",
      options: [{ forVersions: '<1', rangeType: 'pin' }],
    },

    // multiple options (last one wins)
    ...[
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
		"abc": "~1.2.3",
        "def": "workspace:~1.2.3",
        "ghi": "workspace:~",
	}
}`,
      name: `[{ rangeType: "pin" }, { rangeType: "tilde" }]; dependencyType: '${dependencyType}'`,
      options: [[{ rangeType: 'pin' }, { rangeType: 'tilde' }]],
    })),
  ],
});
