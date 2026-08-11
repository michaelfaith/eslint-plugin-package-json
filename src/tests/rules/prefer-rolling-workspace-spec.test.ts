import { rule } from '../../rules/prefer-rolling-workspace-spec.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('prefer-rolling-workspace-spec', rule, {
  invalid: [
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
      errors: [
        {
          column: 12,
          line: 3,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:*",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 4,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 5,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 6,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 7,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 8,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 9,
          messageId: 'nonRollingWorkspaceSpec',
        },
      ],
      filename: 'package.json',
      name: dependencyType,
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
      errors: [
        {
          column: 12,
          line: 4,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 5,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 6,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 7,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 8,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 9,
          messageId: 'nonRollingWorkspaceSpec',
        },
      ],
      filename: 'package.json',
      name: `${dependencyType}; ignoreDependencies: abc`,
      options: [{ ignoreDependencies: ['abc'] }],
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
      errors: [
        {
          column: 12,
          line: 3,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:*",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 5,
          messageId: 'nonRollingWorkspaceSpec',
          suggestions: [
            {
              messageId: 'convertToRolling',
              output: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
            },
          ],
        },
        {
          column: 12,
          line: 6,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 7,
          messageId: 'nonRollingWorkspaceSpec',
        },
        {
          column: 12,
          line: 8,
          messageId: 'nonRollingWorkspaceSpec',
        },
      ],
      filename: 'package.json',
      name: `${dependencyType}; ignorePatterns: ..[fu]`,
      options: [{ ignorePatterns: ['..[fu]'] }],
    })),
  ],
  valid: [
    '{}',
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {}
}`,
      name: `${dependencyType}; no deps`,
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
	"${dependencyType}": []
}`,
      name: `${dependencyType}; invalid type`,
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
    "abc": "1.2.3",
    "def": "^1.2.3",
    "ghi": "~1.2.3",
    "jkl": ">=1.2.3",
    "mno": ">1.2.3",
    "pqr": "<=1.2.3",
    "stu": "<1.2.3",
    "vwx": "*"
  }
}`,
      name: `${dependencyType}; no workspace`,
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
	"${dependencyType}": {
    "abc": "workspace:",
    "def": "workspace:*",
    "ghi": "workspace:^",
    "jkl": "workspace:~"
  }
}`,
      name: `${dependencyType}; rolling workspace spec`,
    })),
    ...['dependencies', 'devDependencies'].map((dependencyType) => ({
      code: `{
  "${dependencyType}": {
    "abc": "workspace:1.2.3",
    "def": "workspace:^1.2.3",
    "ghi": "workspace:~1.2.3",
    "jkl": "workspace:>=1.2.3",
    "mno": "workspace:>1.2.3",
    "pqr": "workspace:<=1.2.3",
    "stu": "workspace:<1.2.3"
  }
}`,
      name: `${dependencyType}; ignorePatterns: \\w{3}`,
      options: [{ ignorePatterns: ['\\w{3}'] }],
    })),
  ],
});
