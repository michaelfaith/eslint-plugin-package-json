import { rule } from '../../rules/repository-shorthand.ts';
import { ruleTester } from './ruleTester.ts';

ruleTester.run('repository-shorthand', rule, {
  invalid: [
    {
      code: `{ "repository": "" }`,
      errors: [
        {
          column: 17,
          line: 1,
          messageId: 'preferObject',
        },
      ],
    },
    {
      code: `{ "repository": "invalid" }`,
      errors: [
        {
          column: 17,
          line: 1,
          messageId: 'preferObject',
        },
      ],
    },
    {
      code: `{ "repository": "invalid/" }`,
      errors: [
        {
          column: 17,
          line: 1,
          messageId: 'preferObject',
        },
      ],
    },
    {
      code: `{
				"repository": "michaelfaith/eslint-plugin-package-json"
			}`,
      errors: [
        {
          column: 19,
          line: 2,
          messageId: 'preferObject',
        },
      ],
      output: `{
				"repository": {
  "type": "git",
  "url": "https://github.com/michaelfaith/eslint-plugin-package-json"
}
			}`,
    },
    {
      code: `{
				"repository": "github:michaelfaith/eslint-plugin-package-json"
			}`,
      errors: [
        {
          column: 19,
          line: 2,
          messageId: 'preferObject',
        },
      ],
      output: `{
				"repository": {
  "type": "git",
  "url": "https://github.com/michaelfaith/eslint-plugin-package-json"
}
			}`,
    },
    {
      code: `{
				"repository": "gibberish:michaelfaith/eslint-plugin-package-json"
			}`,
      errors: [
        {
          messageId: 'preferObject',
        },
      ],
      output: `{
				"repository": {
  "type": "git",
  "url": "https://github.com/gibberish:michaelfaith/eslint-plugin-package-json"
}
			}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://github.com/michaelfaith/eslint-plugin-package-json"
				}
			}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "github:michaelfaith/eslint-plugin-package-json"
			}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "git+https://github.com/michaelfaith/eslint-plugin-package-json.git"
				}
			}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "github:michaelfaith/eslint-plugin-package-json"
			}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "git+ssh://git@github.com/michaelfaith/eslint-plugin-package-json.git"
				}
			}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "github:michaelfaith/eslint-plugin-package-json"
			}`,
    },
    {
      code: `{
				"repository": "https://github.com/eslint/eslint"
			}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "github:eslint/eslint"
			}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://gitlab.com/michaelfaith/eslint-plugin-package-json"
				}
		}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "gitlab:michaelfaith/eslint-plugin-package-json"
		}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://bitbucket.org/eslint/rewrite"
				}
		}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "bitbucket:eslint/rewrite"
		}`,
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://gist.github.com/1234567890abcdef"
				}
		}`,
      errors: [
        {
          messageId: 'preferShorthand',
        },
      ],
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
      output: `{
				"repository": "gist:1234567890abcdef"
		}`,
    },
  ],
  valid: [
    `{ "repository": null }`,
    `{ "repository": 123 }`,
    `{
			"repository": {
				"type": "git"
			}
		}`,
    `{
			"repository": {
				"url": "https://github.com/michaelfaith/eslint-plugin-package-json"
			}
		}`,
    `{
			"repository": {
				"type": "git",
				"url": "https://github.com/michaelfaith/eslint-plugin-package-json"
			}
		}`,
    `{
			"repository": {
				"type": "git",
				"url": "https://gist.github.com/michaelfaith/1234567890abcdef"
			}
		}`,
    `{
			"repository": {
				"type": "git",
				"url": "https://bitbucket.org/michaelfaith/eslint-plugin-package-json"
			}
		}`,
    `{
			"repository": {
				"type": "git",
				"url": "https://gitlab.com/michaelfaith/eslint-plugin-package-json"
			}
		}`,
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://github.com/michaelfaith/eslint-plugin-package-json"
				}
			}`,
      options: [{ form: 'object' }],
    },
    {
      code: `{
				"repository": null,
			}`,
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": 123,
			}`,
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://github.com/facebook/react.git",
					"directory": "packages/react"
				}
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": {
					"url": "https://github.com/facebook/react.git",
				}
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": "browserslist/browserslist"
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": "github:browserslist/browserslist"
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": "gist:1234567890abcdef"
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": "bitbucket:browserslist/browserslist"
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": "gitlab:browserslist/browserslist"
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"outer": {
					"repository": "https://github.com/a/b"
				}
			}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
    {
      code: `{
				"repository": {
					"type": "git",
					"url": "https://gibberish.org/eslint/rewrite"
				}
		}`,
      filename: 'package.json',
      options: [{ form: 'shorthand' }],
    },
  ],
});
