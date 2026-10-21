import { rule } from '../../rules/consistent-package-manager-declaration.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('consistent-package-manager-declaration', rule, {
  invalid: [
    // prefer: devEngines (default)
    {
      code: `{
  "name": "test",
  "packageManager": "pnpm@12.14.0"
}
`,
      errors: [
        {
          column: 3,
          line: 3,
          messageId: 'preferDevEngines',
        },
      ],
      output: `{
  "name": "test",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
    },
    {
      code: `{
  "packageManager": "pnpm@12.14.0"
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines' }],
      name: 'packageManager > prefer: devEngines',
      options: [{ prefer: 'devEngines' }],
      output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
    },
    {
      code: `{
\t"packageManager": "npm@11.6.2-rc.1"
}
`,
      errors: [{ column: 2, line: 2, messageId: 'preferDevEngines' }],
      output: `{
\t"devEngines": {
\t\t"packageManager": {
\t\t\t"name": "npm",
\t\t\t"version": "11.6.2-rc.1"
\t\t}
\t}
}
`,
    },
    {
      code: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": ">=24"
    }
  }
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines' }],
      output: `{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": ">=24"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
    },
    {
      code: `{
  "name": "test",
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  },
  "version": "1.0.0"
}
`,
      errors: [{ column: 3, line: 3, messageId: 'preferDevEngines' }],
      output: `{
  "name": "test",
  "devEngines": {
    "runtime": {
      "name": "node"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  },
  "version": "1.0.0"
}
`,
    },
    {
      code: `{
  "devEngines": {},
  "packageManager": "pnpm@12.14.0"
}
`,
      errors: [{ column: 3, line: 3, messageId: 'preferDevEngines' }],
      output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
    },
    // The integrity hash can't be kept in devEngines, so moving is only suggested
    {
      code: `{
  "packageManager": "pnpm@12.14.0+sha512.abc123"
}
`,
      errors: [
        {
          column: 3,
          line: 2,
          messageId: 'preferDevEngines',
          suggestions: [
            {
              messageId: 'moveToDevEngines',
              output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
            },
          ],
        },
      ],
    },
    // Both are declared and match, so the top-level field is safely removed
    {
      code: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines' }],
      output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
    },
    // Both are declared but differ, so removal is only suggested
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^12.0.0"
    }
  },
  "packageManager": "pnpm@12.14.0"
}
`,
      errors: [
        {
          column: 3,
          line: 8,
          messageId: 'preferDevEngines',
          suggestions: [
            {
              messageId: 'removePackageManager',
              output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^12.0.0"
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
  "packageManager": "pnpm@12.14.0+sha512.abc123",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [
        {
          column: 3,
          line: 2,
          messageId: 'preferDevEngines',
          suggestions: [
            {
              messageId: 'removePackageManager',
              output: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
            },
          ],
        },
      ],
    },
    // Values that can't be converted are reported without a fix
    {
      code: `{
  "packageManager": "pnpm"
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines', suggestions: [] }],
    },
    {
      code: `{
  "packageManager": "pnpm@^12.0.0"
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines', suggestions: [] }],
    },
    {
      code: `{
  "packageManager": 123
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines', suggestions: [] }],
    },
    {
      code: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": "invalid"
}
`,
      errors: [{ column: 3, line: 2, messageId: 'preferDevEngines', suggestions: [] }],
    },

    // prefer: packageManager
    {
      code: `{
  "name": "test",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [
        {
          column: 5,
          line: 4,
          messageId: 'preferPackageManager',
        },
      ],
      name: 'devEngines.packageManager > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
      output: `{
  "name": "test",
  "packageManager": "pnpm@12.14.0"
}
`,
    },
    {
      code: `{
  "devEngines": {
    "runtime": {
      "name": "node"
    },
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 6, messageId: 'preferPackageManager' }],
      name: 'devEngines.packageManager after other entries > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
      output: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  }
}
`,
    },
    {
      code: `{
  "name": "test",
  "devEngines": {
    "packageManager": {
      "name": "yarn",
      "version": "4.10.3"
    },
    "runtime": {
      "name": "node"
    }
  }
}
`,
      errors: [{ column: 5, line: 4, messageId: 'preferPackageManager' }],
      name: 'devEngines.packageManager before other entries > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
      output: `{
  "name": "test",
  "packageManager": "yarn@4.10.3",
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  }
}
`,
    },
    // `onFail` can't be kept in the packageManager field, so moving is only suggested
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0",
      "onFail": "download"
    }
  }
}
`,
      errors: [
        {
          column: 5,
          line: 3,
          messageId: 'preferPackageManager',
          suggestions: [
            {
              messageId: 'moveToPackageManager',
              output: `{
  "packageManager": "pnpm@12.14.0"
}
`,
            },
          ],
        },
      ],
      name: 'devEngines.packageManager with onFail > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    // Both are declared and match, so devEngines.packageManager is safely removed
    {
      code: `{
  "packageManager": "pnpm@12.14.0+sha512.abc123",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 4, messageId: 'preferPackageManager' }],
      name: 'matching fields, packageManager has a hash > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
      output: `{
  "packageManager": "pnpm@12.14.0+sha512.abc123"
}
`,
    },
    {
      code: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    },
    "runtime": {
      "name": "node"
    }
  }
}
`,
      errors: [{ column: 5, line: 4, messageId: 'preferPackageManager' }],
      name: 'matching fields, devEngines has other entries > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
      output: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  }
}
`,
    },
    // Both are declared but differ, so removal is only suggested
    {
      code: `{
  "packageManager": "pnpm@12.14.0",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^12.0.0",
      "onFail": "error"
    }
  }
}
`,
      errors: [
        {
          column: 5,
          line: 4,
          messageId: 'preferPackageManager',
          suggestions: [
            {
              messageId: 'removeDevEnginesPackageManager',
              output: `{
  "packageManager": "pnpm@12.14.0"
}
`,
            },
          ],
        },
      ],
      name: 'different fields > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    // Values that can't be converted are reported without a fix
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "^12.0.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager with a version range > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm"
    }
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager without a version > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm ",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager name with whitespace > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "@scope/pm",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager name with @ > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "",
      "version": "12.14.0"
    }
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager with an empty name > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "packageManager": [
      {
        "name": "pnpm",
        "version": "12.14.0"
      },
      {
        "name": "npm",
        "version": "11.6.2"
      }
    ]
  }
}
`,
      errors: [{ column: 5, line: 3, messageId: 'preferPackageManager', suggestions: [] }],
      name: 'devEngines.packageManager array > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
  ],
  valid: [
    '{}',
    {
      code: '{}',
      name: 'empty object > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    `{
  "name": "test",
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  }
}`,
    `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}`,
    {
      code: `{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "12.14.0"
    }
  }
}`,
      name: 'devEngines.packageManager > prefer: devEngines',
      options: [{ prefer: 'devEngines' }],
    },
    `{
  "config": {
    "packageManager": "pnpm@12.14.0"
  }
}`,
    {
      code: `{
  "packageManager": "pnpm@12.14.0"
}`,
      name: 'packageManager > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": {
    "runtime": {
      "name": "node"
    }
  }
}`,
      name: 'devEngines without packageManager > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "devEngines": "invalid"
}`,
      name: 'devEngines string > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "config": {
    "devEngines": {
      "packageManager": {
        "name": "pnpm",
        "version": "12.14.0"
      }
    }
  }
}`,
      name: 'nested devEngines.packageManager > prefer: packageManager',
      options: [{ prefer: 'packageManager' }],
    },
    {
      code: `{
  "packageManager": "pnpm@12.14.0"
}`,
      filename: 'not-a-package.json',
    },
  ],
});
