import { rule } from "../../rules/order-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("order-properties", rule, {
  invalid: [
    {
      code: `{
	"main": "index.js",
	"homepage": "https://example.com",
	"version": "1.0.0",
	"name": "order-sort-package-json-implicit",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	}
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "homepage" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      output: `{
	"name": "order-sort-package-json-implicit",
	"version": "1.0.0",
	"homepage": "https://example.com",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	},
	"main": "index.js"
}
`,
    },
    {
      code: `{
	"name": "error-not-started-at-first",
	"main": "index.js",
	"homepage": "https://example.com",
	"version": "1.0.0",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	}
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      output: `{
	"name": "error-not-started-at-first",
	"version": "1.0.0",
	"homepage": "https://example.com",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	},
	"main": "index.js"
}
`,
    },
    {
      code: `{
	"main": "index.js",
	"homepage": "https://example.com",
	"version": "1.0.0",
	"name": "do-not-sort-sub-keys",
	"repository": {
		"url": "git+https://github.com/fake/github.git",
		"type": "git"
	}
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "homepage" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      output: `{
	"name": "do-not-sort-sub-keys",
	"version": "1.0.0",
	"homepage": "https://example.com",
	"repository": {
		"url": "git+https://github.com/fake/github.git",
		"type": "git"
	},
	"main": "index.js"
}
`,
    },
    {
      code: `{
  "main": "index.js",
  "homepage": "https://example.com",
  "version": "1.0.0",
  "name": "respect-indent",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fake/github.git"
  }
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "homepage" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      output: `{
  "name": "respect-indent",
  "version": "1.0.0",
  "homepage": "https://example.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fake/github.git"
  },
  "main": "index.js"
}
`,
    },
    {
      code: `{
	"main": "index.js",
	"homepage": "https://example.com",
	"version": "1.0.0",
	"name": "order-sort-package-json-explicit",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	}
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "homepage" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      options: [{ order: "sort-package-json" }],
      output: `{
	"name": "order-sort-package-json-explicit",
	"version": "1.0.0",
	"homepage": "https://example.com",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	},
	"main": "index.js"
}
`,
    },
    {
      code: `{
	"main": "index.js",
	"homepage": "https://example.com",
	"version": "1.0.0",
	"name": "order-custom",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	}
}
`,
      errors: [
        {
          data: { property: "main" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "homepage" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "repository" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      options: [{ order: ["version", "name", "repository"] }],
      output: `{
	"version": "1.0.0",
	"name": "order-custom",
	"repository": {
		"type": "git",
		"url": "git+https://github.com/fake/github.git"
	},
	"homepage": "https://example.com",
	"main": "index.js"
}
`,
    },
    {
      code: `{
	"b": "workspace-config",
	"cpu": ["x64"],
	"a": "custom",
	"name": "sort-non-standard",
	"version": "1.0.0"
}
`,
      errors: [
        {
          data: { property: "b" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "cpu" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "a" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      output: `{
	"name": "sort-non-standard",
	"version": "1.0.0",
	"cpu": [
		"x64"
	],
	"a": "custom",
	"b": "workspace-config"
}
`,
    },
    {
      code: `{
	"custom-z": "value",
	"name": "custom-order-with-sort",
	"custom-a": "value",
	"version": "1.0.0"
}
`,
      errors: [
        {
          data: { property: "custom-z" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      options: [{ order: ["name", "version"] }],
      output: `{
	"name": "custom-order-with-sort",
	"version": "1.0.0",
	"custom-a": "value",
	"custom-z": "value"
}
`,
    },
    {
      code: ["{", '	"version": "1.0.0",', '	"name": "foo"', "}"].join("\r\n"),
      errors: [
        {
          data: { property: "version" },
          messageId: "incorrectOrder",
        },
        {
          data: { property: "name" },
          messageId: "incorrectOrder",
        },
      ],
      filename: "package.json",
      options: [{ order: ["name", "version"] }],
      output: ["{", '	"name": "foo",', '	"version": "1.0.0"', "}"].join("\r\n"),
    },
  ],
  valid: [
    `{
	"name": "treat-yo-self",
	"version": "1.1.1",
	"description": "Once a year.",
	"keywords": [
		"modern",
		"master"
	]
}`,
    `{
	"name": "treat-yo-self",
	"version": "0.1.0",
	"private": true,
	"description": "Once a year.",
	"keywords": [
		"modern",
		"master"
	]
}
	`,
    {
      code: `{
	"version": "1.1.1",
	"name": "treat-yo-self",
	"description": "Once a year.",
	"keywords": [
		"modern",
		"master"
	]
}
	`,
      options: [{ order: ["version", "name"] }],
    },
    {
      code: `{
	"name": "treat-yo-self",
	"version": "1.1.1",
	"description": "Once a year.",
	"keywords": [
		"modern",
		"master"
	],
	"exports": {
		"import": "./index.js",
		"require": "./index.js"
	},
	"main": "index.js"
}
`,
      options: [{ order: "sort-package-json" }],
    },
    {
      code: `{
    "name": "only-top-level-keys-are-ordered",
    "version": "1.0.0",
    "homepage": "https://example.com",
    "repository": {
        "url": "git+https://github.com/fake/github.git",
        "type": "git"
    },
    "main": "index.js"
}`,
    },
    {
      code: `{
	"name": "sorted-non-standard",
	"version": "1.0.0",
	"cpu": ["x64"],
	"a-custom": "value",
	"z-custom": "value"
}`,
    },
  ],
});
