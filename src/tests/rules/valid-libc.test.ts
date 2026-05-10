import { rules } from "../../rules/valid-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("valid-libc", rules["valid-libc"], {
  invalid: [
    {
      code: `{
	"libc": null
}
`,
      errors: [
        {
          data: {
            error:
              "the value is `null`, but should be an `Array` or a `string`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"libc": 123
}
`,
      errors: [
        {
          data: {
            error: "the type should be `Array` or `string`, not `number`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"libc": ""
}
`,
      errors: [
        {
          data: {
            error:
              "the value is empty, but should be the name of a version of libc",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"libc": {
      "invalid-bin": 123
    }
}
`,
      errors: [
        {
          data: {
            error: "the type should be `Array` or `string`, not `object`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"libc": [
      "",
      123,
      null,
      {}
    ]
}
`,
      errors: [
        {
          data: {
            error:
              "item at index 0 is empty, but should be the name of a version of libc",
          },
          line: 3,
          messageId: "validationError",
        },
        {
          data: {
            error: "item at index 1 should be a string, not `number`",
          },
          line: 4,
          messageId: "validationError",
        },
        {
          data: {
            error: "item at index 2 should be a string, not `null`",
          },
          line: 5,
          messageId: "validationError",
        },
        {
          data: {
            error: "item at index 3 should be a string, not `object`",
          },
          line: 6,
          messageId: "validationError",
        },
      ],
    },
  ],
  valid: [
    "{}",
    `{ "libc": [] }`,
    `{ "libc": ["glibc", "musl"] }`,
    `{ "libc": "glibc" }`,
  ],
});
