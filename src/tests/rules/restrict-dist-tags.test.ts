import { DEPENDENCY_TYPES, rule } from '../../rules/restrict-dist-tags.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('restrict-dist-tags', rule, {
  invalid: [
    ...DEPENDENCY_TYPES.map((dependencyType) => ({
      code: `{
  "${dependencyType}": {
    "package-a": "stable"
  }
}`,
      errors: [
        {
          data: {
            dependencyType,
            tag: 'stable',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: `unknown tag in ${dependencyType}`,
    })),

    {
      code: `{
  "dependencies": {
    "package-a": "latest",
    "package-b": "rc",
    "package-c": "stable"
  }
}`,
      errors: [
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'latest',
          },
          messageId: 'disallowedDistTag',
        },
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'stable',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: 'allowed list',
      options: [{ allowed: ['rc'] }],
    },

    {
      code: `{
  "dependencies": {
    "package-a": "latest"
  },
  "devDependencies": {
    "package-b": "latest"
  }
}`,
      errors: [
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'latest',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: 'allowedFor restricts tags to selected dependency types',
      options: [{ allowedFor: ['devDependencies'] }],
    },

    {
      code: `{
      "dependencies": {
        "package-a": "beta"
      },
      "devDependencies": {
        "package-b": "alpha"
      }
    }`,
      errors: [
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'beta',
          },
          messageId: 'disallowedDistTag',
        },
        {
          data: {
            dependencyType: 'devDependencies',
            tag: 'alpha',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: 'empty allowedFor applies allowed tags to every dependency type',
      options: [{ allowed: ['rc'], allowedFor: [] }],
    },

    {
      code: `{
  "dependencies": {
    "package-a": "beta"
  },
  "devDependencies": {
    "package-b": "rc"
  }
}`,
      errors: [
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'beta',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: 'allowedFor and allowed combination',
      options: [
        {
          allowed: ['rc'],
          allowedFor: ['devDependencies'],
        },
      ],
    },

    {
      code: `{
  "dependencies": {
    "package-a": "next"
  }
}`,
      errors: [
        {
          data: {
            dependencyType: 'dependencies',
            tag: 'next',
          },
          messageId: 'disallowedDistTag',
        },
      ],
      name: 'empty allowed rejects every dist-tag',
      options: [{ allowed: [] }],
    },
  ],

  valid: [
    '{}',
    '{ "dependencies": {} }',

    ...DEPENDENCY_TYPES.map(
      (dependencyType) => `{
  "${dependencyType}": {
    "latest": "latest",
    "dev": "dev",
    "next": "next",
    "alpha": "alpha",
    "beta": "beta",
    "canary": "canary",
    "rc": "rc"
  }
}`,
    ),

    {
      code: `{
  "dependencies": {
    "package-a": "rc"
  }
}`,
      options: [{ allowed: ['rc'] }],
    },

    {
      code: `{
  "dependencies": {
    "package-a": "rc"
  },
  "devDependencies": {
    "package-b": "rc"
  },
  "optionalDependencies": {
    "package-c": "rc"
  },
  "peerDependencies": {
    "package-d": "rc"
  }
}`,
      name: 'empty allowedFor allows tags in every dependency type',
      options: [{ allowed: ['rc'], allowedFor: [] }],
    },

    {
      code: `{
  "dependencies": {
    "package-a": "^1.2.3",
    "package-b": "~1.2.3",
    "package-c": ">=1.2.3",
    "package-d": "1.2.3",
    "package-e": "*"
  }
}`,
    },

    {
      code: `{
  "dependencies": {
    "package-a": "workspace:*",
    "package-b": "workspace:^",
    "package-c": "workspace:~1.2.3",
    "package-d": "workspace:1.2.3"
  }
}`,
    },

    {
      code: `{
  "dependencies": {
    "package-a": "file:../package-a",
    "package-b": "../package-b",
    "package-c": "link:../package-c",
    "package-d": "git+https://github.com/example/package-d.git",
    "package-e": "https://example.com/package-e.tgz",
    "package-f": "npm:other-package@1.2.3",
    "package-g": "catalog:"
  }
}`,
    },

    {
      code: `{
  "dependencies": {
    "package-a": 123,
    "package-b": null,
    "package-c": {},
    "package-d": true
  }
}`,
    },

    {
      code: `{
  "dependencies": {
    "package-a": "stable"
  }
}`,
      filename: 'not-package.json',
      options: [{ allowed: [] }],
    },
  ],
});
