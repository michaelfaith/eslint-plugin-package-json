import { rules } from "../../rules/valid-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("valid-browser", rules["valid-browser"], {
  invalid: [
    {
      code: `{
	"browser": null
}
`,
      errors: [
        {
          data: {
            error: "the value is `null`, but should be a `string`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"browser": 123
}
`,
      errors: [
        {
          data: {
            error: "the type should be a `string`, not `number`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"browser": []
}
`,
      errors: [
        {
          data: {
            error: "the type should be a `string`, not `Array`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"browser": ""
}
`,
      errors: [
        {
          data: {
            error:
              "the value is empty, but should be the path to the module that should be used in the browser",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
  ],
  valid: [
    "{}",
    `{ "browser": "./index.umd.js" }`,
    `{ "browser": "index.umd.js" }`,
  ],
});
