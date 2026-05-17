import { rule } from '../../rules/exports-subpaths-style.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('exports-subpaths-style', rule, {
  invalid: [
    // ============================================================
    // Explicit mode (default) - implicit formats → explicit
    // ============================================================
    {
      code: `{ "exports": "./index.js" }`,
      errors: [{ messageId: 'preferExplicit' }],
      output: `{ "exports": {
  ".": "./index.js"
} }`,
    },
    {
      code: `{
				"exports": {
					"import": "./index.mjs",
					"require": "./index.cjs"
				}
			}`,
      errors: [{ messageId: 'preferExplicit' }],
      output: `{
				"exports": {
  ".": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
			}`,
    },
    {
      code: `{ "exports": 123 }`,
      errors: [{ messageId: 'preferExplicit' }],
      output: `{ "exports": {
  ".": 123
} }`,
    },
    {
      code: `{ "exports": true }`,
      errors: [{ messageId: 'preferExplicit' }],
      output: `{ "exports": {
  ".": true
} }`,
    },
    {
      code: `{ "exports": null }`,
      errors: [{ messageId: 'preferExplicit' }],
      output: `{ "exports": {
  ".": null
} }`,
    },
    // With explicit option
    {
      code: `{ "exports": "./index.js" }`,
      errors: [{ messageId: 'preferExplicit' }],
      options: [{ prefer: 'explicit' }],
      output: `{ "exports": {
  ".": "./index.js"
} }`,
    },

    // ============================================================
    // Implicit mode - explicit formats → implicit
    // ============================================================
    {
      code: `{
				"exports": {
					".": "./index.js"
				}
			}`,
      errors: [{ messageId: 'preferImplicit' }],
      options: [{ prefer: 'implicit' }],
      output: `{
				"exports": "./index.js"
			}`,
    },
    {
      code: `{
				"exports": {
					".": {
						"import": "./index.mjs",
						"require": "./index.cjs"
					}
				}
			}`,
      errors: [{ messageId: 'preferImplicit' }],
      options: [{ prefer: 'implicit' }],
      output: `{
				"exports": {
  "import": "./index.mjs",
  "require": "./index.cjs"
}
			}`,
    },
    {
      code: `{
				"exports": {
					".": ["./index.js"]
				}
			}`,
      errors: [{ messageId: 'preferImplicit' }],
      options: [{ prefer: 'implicit' }],
      output: `{
				"exports": [
  "./index.js"
]
			}`,
    },
  ],
  valid: [
    // ============================================================
    // Explicit mode (default) - already in explicit format
    // ============================================================
    `{
			"exports": {
				".": "./index.js"
			}
		}`,
    `{
			"exports": {
				".": {
					"import": "./index.mjs",
					"require": "./index.cjs"
				}
			}
		}`,
    `{
			"exports": {
				".": {
					"types": "./index.d.ts",
					"import": "./index.mjs",
					"require": "./index.cjs"
				}
			}
		}`,
    {
      code: `{
				"exports": {
					".": null
				}
			}`,
      options: [{ prefer: 'explicit' }],
    },
    // Multiple subpaths (can't be simplified)
    `{
			"exports": {
				".": "./index.js",
				"./util": "./util.js"
			}
		}`,
    // Root-level arrays are implicit format (not transformable)
    `{ "exports": ["./index.js"] }`,

    // ============================================================
    // Implicit mode - already in implicit format
    // ============================================================
    {
      code: `{ "exports": "./index.js" }`,
      options: [{ prefer: 'implicit' }],
    },
    {
      code: `{
				"exports": {
					"import": "./index.mjs",
					"require": "./index.cjs"
				}
			}`,
      options: [{ prefer: 'implicit' }],
    },
    // Multiple subpaths (can't be simplified)
    {
      code: `{
				"exports": {
					".": "./index.js",
					"./util": "./util.js"
				}
			}`,
      options: [{ prefer: 'implicit' }],
    },
    // Single non-root subpath (can't be simplified)
    {
      code: `{
				"exports": {
					"./foo": "./foo.js"
				}
			}`,
      options: [{ prefer: 'implicit' }],
    },
    // Root-level arrays are implicit format
    {
      code: `{ "exports": ["./index.js"] }`,
      options: [{ prefer: 'implicit' }],
    },

    // ============================================================
    // Edge cases
    // ============================================================
    // Nested exports field (not at root level, ignored)
    {
      code: `{
				"nested": {
					"exports": "./index.js"
				}
			}`,
      options: [{ prefer: 'explicit' }],
    },
  ],
});
