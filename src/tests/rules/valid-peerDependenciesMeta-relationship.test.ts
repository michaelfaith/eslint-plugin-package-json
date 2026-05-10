import { rule } from "../../rules/valid-peerDependenciesMeta-relationship.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("valid-peerDependenciesMeta-relationship", rule, {
  invalid: [
    {
      code: `{
	"peerDependenciesMeta": {
		"some-package": {
			"optional": true
		}
	}
}
`,
      errors: [
        {
          column: 3,
          data: { dependencyName: "some-package" },
          line: 3,
          messageId: "unnecessaryPeerDependency",
          suggestions: [
            {
              messageId: "removePeerDependencyMeta",
              output: `{
	"peerDependenciesMeta": {
\t\t
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
	"peerDependencies": {
		"another-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
		"some-package": {
      "optional": true
    }
  }
}
`,
      errors: [
        {
          column: 3,
          data: { dependencyName: "some-package" },
          line: 6,
          messageId: "unnecessaryPeerDependency",
          suggestions: [
            {
              messageId: "removePeerDependencyMeta",
              output: `{
	"peerDependencies": {
		"another-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
\t\t
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
	"peerDependencies": {
		"some-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
		"another-package": {
			"optional": true
		},
		"some-package": {
			"optional": true
		}
	}
}
`,
      errors: [
        {
          column: 3,
          data: { dependencyName: "another-package" },
          line: 6,
          messageId: "unnecessaryPeerDependency",
          suggestions: [
            {
              messageId: "removePeerDependencyMeta",
              output: `{
	"peerDependencies": {
		"some-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
\t\t
		"some-package": {
			"optional": true
		}
	}
}
`,
            },
          ],
        },
      ],
    },
  ],
  valid: [
    "{}",
    '{ "peerDependencies": [] }',
    '{ "peerDependenciesMeta": [] }',
    '{ "peerDependencies": { 123: "^1.0.0" } }',
    '{ "peerDependenciesMeta": { 123: { "optional": true } } }',
    `{
	"peerDependencies": {
		"some-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
		"some-package": {
      "optional": true
    }
  }
}
`,
    `{
	"peerDependencies": {
		"some-package": "^1.0.0"
	},
}
`,
    `{
	"peerDependencies": {
    "another-package": "^1.0.0",
		"some-package": "^1.0.0"
	},
	"peerDependenciesMeta": {
		"some-package": {
      "optional": true
    }
  }
}
`,
  ],
});
