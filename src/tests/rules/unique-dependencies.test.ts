import { rule } from "../../rules/unique-dependencies.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("unique-dependencies", rule, {
  invalid: [
    {
      code: `{
		"bundleDependencies": ["abc", "abc"]
	}`,
      errors: [
        {
          line: 2,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
		"bundleDependencies": [ "abc"]
	}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    {
      code: `{
		"bundledDependencies": ["abc", "abc"]
	}`,
      errors: [
        {
          line: 2,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
		"bundledDependencies": [ "abc"]
	}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    // ...
    {
      code: `{
	"dependencies": {
		"abc": "1.2.3",
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 3,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
	"dependencies": {
\t\t
		"abc": "1.2.3"
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    // ...
    {
      code: `{
	"devDependencies": {
		"abc": "1.2.3",
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 3,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
	"devDependencies": {
\t\t
		"abc": "1.2.3"
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    {
      code: `{
	"optionalDependencies": {
		"abc": "1.2.3",
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 3,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
	"optionalDependencies": {
\t\t
		"abc": "1.2.3"
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    {
      code: `{
	"peerDependencies": {
		"abc": "1.2.3",
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 3,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
	"peerDependencies": {
\t\t
		"abc": "1.2.3"
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    // ...
    // ...
    {
      code: `{
		"overrides": {"abc": "1.2.3", "abc": "1.2.3"}
	}`,
      errors: [
        {
          line: 2,
          messageId: "overridden",
          suggestions: [
            {
              messageId: "remove",
              output: `{
		"overrides": { "abc": "1.2.3"}
	}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    {
      code: `{
    "dependencies": {
		"abc": "1.2.3"
    },
	"peerDependencies": {
		"abc": "1.2.3"
	},
	"devDependencies": {
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 6,
          messageId: "crossGroupDuplicate",
          suggestions: [
            {
              messageId: "remove",
              output: `{
    "dependencies": {
		"abc": "1.2.3"
    },
	"peerDependencies": {
\t\t
	},
	"devDependencies": {
		"abc": "1.2.3"
	}
}`,
            },
          ],
        },
        {
          line: 9,
          messageId: "crossGroupDuplicate",
          suggestions: [
            {
              messageId: "remove",
              output: `{
    "dependencies": {
		"abc": "1.2.3"
    },
	"peerDependencies": {
		"abc": "1.2.3"
	},
	"devDependencies": {
\t\t
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    },
    ...["devDependencies", "peerDependencies"].map((dependencyType) => ({
      code: `{
    "dependencies": {
		"abc": "1.2.3"
    },
	"${dependencyType}": {
		"abc": "1.2.3"
	}
}`,
      errors: [
        {
          line: 6,
          messageId: "crossGroupDuplicate",
          suggestions: [
            {
              messageId: "remove",
              output: `{
    "dependencies": {
		"abc": "1.2.3"
    },
	"${dependencyType}": {
\t\t
	}
}`,
            },
          ],
        },
      ],
      filename: "package.json",
    })),
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
		"abc": "1.2.3",
		"def": "1.2.3"
	}
}`,
    `{
	"devDependencies": {}
}`,
    `{
	"devDependencies": {
		"abc": "1.2.3"
	}
}`,
    `{
	"devDependencies": {
		"abc": "1.2.3"
	},
    "peerDependencies": {
		"abc": "1.2.3"
	}
}`,
    `{
	"devDependencies": {
		"abc": "1.2.3",
		"def": "1.2.3"
	}
}`,
    `{
	"peerDependencies": {}
}`,
    `{
	"peerDependencies": {
		"abc": "1.2.3"
	}
}`,
    `{
	"peerDependencies": {
		"abc": "1.2.3",
		"def": "1.2.3"
	}
}`,
    `{
	"optionalDependencies": {}
}`,
    `{
	"optionalDependencies": {
		"abc": "1.2.3"
	}
}`,
    `{
	"optionalDependencies": {
		"abc": "1.2.3",
		"def": "1.2.3"
	}
}`,
    `{
	"overrides": {}
}`,
    `{
	"overrides": {
    "abc": "1.2.3"
  }
}`,
    `{
	"overrides": {
    "abc": "1.2.3",
    "def": "1.2.3"
  }
}`,
    `{
	"unrelated": ["abc", "abc"]
}`,
    `{
	"unrelated": {
		"abc": "1.2.3",
		"abc": "1.2.3"
	}
}`,
  ],
});
