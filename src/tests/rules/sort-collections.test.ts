import { rule } from '../../rules/sort-collections.ts';
import { ruleTester } from './ruleTester.ts';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('sort-collections', rule, {
  invalid: [
    {
      code: `{
  "scripts": {
    "watch": "webpack-dev-server",
    "build": "webpack"
  }
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
  "scripts": {
    "build": "webpack",
    "watch": "webpack-dev-server"
  }
}`,
    },
    {
      code: `{
	"scripts": {
		"build": "webpack",
		"postwatch": "echo test",
		"prebuild": "echo test",
		"watch": "webpack-dev-server"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
	"scripts": {
		"prebuild": "echo test",
		"build": "webpack",
		"watch": "webpack-dev-server",
		"postwatch": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"postbuild": "echo test",
		"build": "echo test"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
	"scripts": {
		"build": "echo test",
		"postbuild": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"build": "echo test",
		"prebuild": "echo test"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
	"scripts": {
		"prebuild": "echo test",
		"build": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"prebuild": "echo test",
		"postbuild": "echo test"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
	"scripts": {
		"postbuild": "echo test",
		"prebuild": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"postinstall": "echo test",
		"preinstall": "echo test"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedScripts',
        },
      ],
      filename: 'package.json',
      output: `{
	"scripts": {
		"preinstall": "echo test",
		"postinstall": "echo test"
	}
}`,
    },
    {
      code: `{
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "import": "./index.mjs",
      "require": "./index.js",
      "types": "./index.d.ts"
    }
  }
}`,
      errors: [
        {
          data: { key: 'exports' },
          messageId: 'unsortedKeys',
        },
      ],
      filename: 'package.json',
      output: `{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js",
      "types": "./index.d.ts"
    },
    "./package.json": "./package.json"
  }
}`,
    },
    {
      code: `{
	"pnpm": {
		"patchedDependencies": {
			"typescript@4.8.4": "patches/typescript@4.8.4.patch",
			"eslint-plugin-package-json@0.31.0": "patches/eslint-plugin-package-json@0.31.0.patch"
		}
	}
}`,
      errors: [
        {
          data: { key: 'pnpm.patchedDependencies' },
          messageId: 'unsortedKeys',
        },
      ],
      filename: 'package.json',
      options: [['pnpm.patchedDependencies']],
      output: `{
	"pnpm": {
		"patchedDependencies": {
			"eslint-plugin-package-json@0.31.0": "patches/eslint-plugin-package-json@0.31.0.patch",
			"typescript@4.8.4": "patches/typescript@4.8.4.patch"
		}
	}
}`,
    },
    {
      code: `{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "vue": "2",
        "react": "17"
      }
    }
  }
}`,
      errors: [
        {
          data: { key: 'pnpm.peerDependencyRules.allowedVersions' },
          messageId: 'unsortedKeys',
        },
      ],
      filename: 'package.json',
      options: [['pnpm.peerDependencyRules.allowedVersions']],
      output: `{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "react": "17",
        "vue": "2"
      }
    }
  }
}`,
    },
    {
      code: `{
  "nx": {
    "affected": {},
    "npmScope": "test"
  }
}`,
      errors: [
        {
          data: { key: 'nx' },
          messageId: 'unsortedOrder',
        },
      ],
      filename: 'package.json',
      name: 'custom order: listed keys follow the specified order',
      options: [[{ key: 'nx', order: ['npmScope', 'affected'] }]],
      output: `{
  "nx": {
    "npmScope": "test",
    "affected": {}
  }
}`,
    },
    {
      code: `{
	"nx": {
		"workspaceLayout": {},
		"affected": {},
		"npmScope": "test"
	}
}`,
      errors: [
        {
          data: { key: 'nx' },
          messageId: 'unsortedOrder',
        },
      ],
      filename: 'package.json',
      name: 'custom order: unlisted keys appended in lexicographical order',
      options: [[{ key: 'nx', order: ['npmScope', 'affected'] }]],
      output: `{
	"nx": {
		"npmScope": "test",
		"affected": {},
		"workspaceLayout": {}
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"build": "echo build",
		"prebuild": "echo prebuild",
		"postbuild": "echo postbuild",
		"watch": "echo watch"
	}
}`,
      errors: [
        {
          data: { key: 'scripts' },
          messageId: 'unsortedOrder',
        },
      ],
      filename: 'package.json',
      name: 'custom order on scripts keeps unlisted keys lifecycle-aware',
      options: [[{ key: 'scripts', order: ['watch'] }]],
      output: `{
	"scripts": {
		"watch": "echo watch",
		"prebuild": "echo prebuild",
		"build": "echo build",
		"postbuild": "echo postbuild"
	}
}`,
    },
  ],

  valid: [
    {
      code: `{
	"scripts": {
		"build": "webpack",
		"watch": "webpack-dev-server"
	}
}`,
      filename: 'package.json',
    },
    // ignore if custom include rule
    {
      code: `{
	"scripts": {
		"build": "webpack",
		"watch": "webpack-dev-server"
	}
}`,
      filename: 'package.json',
      options: [['devDependencies']],
    },
    {
      code: `{
		"scripts": { "watch": "out of order...", "build": "but okay" }
}`,
      filename: 'not-a-package.json',
      options: [['devDependencies']],
    },
    {
      code: `{
	"scripts": {
		"lint": "echo test",
        "poster": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
		"pretest": "echo test",
        "watch": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
        "postwatch": "echo test",
		"pretest": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
        "prebuild": "echo test",
		"build": "echo test",
        "postbuild": "echo test"
	}
}`,
    },
    {
      code: `{
	"scripts": {
        "preinstall": "echo test",
        "postinstall": "echo test"
	}
}`,
    },
    {
      code: `{
	"nested": {
		"devDependencies": {
			"typescript": "4.8.4",
			"eslint-plugin-package-json": "0.31.0"
		}
	}
}`,
    },
    {
      code: `{
	"pnpm": {
		"patchedDependencies": {
			"eslint-plugin-package-json@0.31.0": "patches/eslint-plugin-package-json@0.31.0.patch",
			"typescript@4.8.4": "patches/typescript@4.8.4.patch"
		}
	}
}`,
    },
    {
      code: `{
	"pnpm": {
		"peerDependencyRules": {
            "allowedVersions": {
                "vue": "2",
                "react": "17"
            }
		}
	}
}`,
    },
    {
      code: `{
	"pnpm": {
		"peerDependencyRules": {
            "allowedVersions": {
                "react": "17",
                "vue": "2"
            }
		}
	}
}`,
      options: [['pnpm.peerDependencyRules.allowedVersions']],
    },

    {
      code: `{
  "foo": [
    {
      "bar": {
        "b": 2,
        "a": 1
      }
    }
  ]
}`,
      options: [['foo.bar']],
    },
    {
      code: `{
  "foo": [
    {
      "bar": {
        "b": 2,
        "a": 1
      }
    }
  ]
}`,
      options: [['foo.0.bar']],
    },
    // custom order: already in the specified order
    {
      code: `{
	"nx": {
		"npmScope": "test",
		"affected": {}
	}
}`,
      filename: 'package.json',
      name: 'custom order: already in the specified order',
      options: [[{ key: 'nx', order: ['npmScope', 'affected'] }]],
    },
    // custom order: unlisted keys already appended lexicographically
    {
      code: `{
	"nx": {
		"npmScope": "test",
		"affected": {},
		"workspaceLayout": {}
	}
}`,
      filename: 'package.json',
      name: 'custom order: unlisted keys already appended lexicographically',
      options: [[{ key: 'nx', order: ['npmScope', 'affected'] }]],
    },
    // mixed array: string entries and object entries coexist
    {
      code: `{
	"devDependencies": {
		"a": "1",
		"b": "2"
	},
	"nx": {
		"npmScope": "test",
		"affected": {}
	}
}`,
      filename: 'package.json',
      name: 'mixed array: string entries and object entries coexist',
      options: [
        ['devDependencies', { key: 'nx', order: ['npmScope', 'affected'] }],
      ],
    },
    // custom order on `scripts`: listed key first, unlisted keys already in
    // lifecycle-aware order
    {
      code: `{
	"scripts": {
		"watch": "echo watch",
		"prebuild": "echo prebuild",
		"build": "echo build",
		"postbuild": "echo postbuild"
	}
}`,
      filename: 'package.json',
      name: 'custom order on scripts with unlisted keys already lifecycle-sorted',
      options: [[{ key: 'scripts', order: ['watch'] }]],
    },
  ],
});
