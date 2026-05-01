import { rules } from "../../rules/valid-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run(
  "valid-peerDependenciesMeta",
  rules["valid-peerDependenciesMeta"],
  {
    invalid: [
      {
        code: `{
	"peerDependenciesMeta": null
}
`,
        errors: [
          {
            data: {
              error:
                "the value is `null`, but should be an object with peer dependency metadata",
            },
            line: 2,
            messageId: "validationError",
          },
        ],
      },
      {
        code: `{
	"peerDependenciesMeta": 123
}
`,
        errors: [
          {
            data: {
              error: "the type should be `object`, not `number`",
            },
            line: 2,
            messageId: "validationError",
          },
        ],
      },
      {
        code: `{
	"peerDependenciesMeta": "./script.js"
}
`,
        errors: [
          {
            data: {
              error: "the type should be `object`, not `string`",
            },
            line: 2,
            messageId: "validationError",
          },
        ],
      },
      {
        code: `{
	"peerDependenciesMeta": []
}
`,
        errors: [
          {
            data: {
              error: "the type should be `object`, not `Array`",
            },
            line: 2,
            messageId: "validationError",
          },
        ],
      },
      {
        code: `{
	"peerDependenciesMeta": {
        "david": "bowie",
        "trent": 123,
        "the-fragile": null,
        "pink-floyd": [],
        "": {
          "optional": true
        }
    }
}
`,
        errors: [
          {
            column: 18,
            data: {
              error:
                "the value for peer dependency metadata `david` should be an object, not `string`",
            },
            line: 3,
            messageId: "validationError",
          },
          {
            column: 18,
            data: {
              error:
                "the value for peer dependency metadata `trent` should be an object, not `number`",
            },
            line: 4,
            messageId: "validationError",
          },
          {
            column: 24,
            data: {
              error:
                "the value for peer dependency metadata `the-fragile` should be an object, not `null`",
            },
            line: 5,
            messageId: "validationError",
          },
          {
            column: 23,
            data: {
              error:
                "the value for peer dependency metadata `pink-floyd` should be an object, not `Array`",
            },
            line: 6,
            messageId: "validationError",
          },
          {
            column: 13,
            data: {
              error: "invalid package name: ``",
            },
            line: 7,
            messageId: "validationError",
          },
        ],
      },
      {
        code: `{
	"peerDependenciesMeta": {
        "david": {},
        "trent": {
          "reznor": "^1.0.0"
        },
        "the-fragile": {
          "optional": true,
          "things": "falling-apart"
        },
        "with-teeth": {
          "": true
        }
    }
}
`,
        errors: [
          {
            column: 18,
            data: {
              error:
                "peer dependency metadata for `david` should contain the `optional` property",
            },
            line: 3,
            messageId: "validationError",
          },
          {
            column: 18,
            data: {
              error:
                "peer dependency metadata for `trent` should contain the `optional` property",
            },
            line: 4,
            messageId: "validationError",
          },
          {
            column: 21,
            data: {
              error:
                "unexpected property `reznor`; only `optional` is allowed in peer dependency metadata",
            },
            line: 5,
            messageId: "validationError",
          },
          {
            column: 21,
            data: {
              error:
                "unexpected property `things`; only `optional` is allowed in peer dependency metadata",
            },
            line: 9,
            messageId: "validationError",
          },
          {
            column: 23,
            data: {
              error:
                "peer dependency metadata for `with-teeth` should contain the `optional` property",
            },
            line: 11,
            messageId: "validationError",
          },
          {
            column: 15,
            data: {
              error:
                "unexpected property ``; only `optional` is allowed in peer dependency metadata",
            },
            line: 12,
            messageId: "validationError",
          },
        ],
      },
    ],
    valid: [
      "{}",
      `{
  "peerDependenciesMeta": {
    "silver-mt-zion": {
      "optional": true
    }
  }
}`,
      `{ "peerDependenciesMeta": {} }`,
    ],
  },
);
