import { rules } from "../../rules/valid-properties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.run("valid-gypfile", rules["valid-gypfile"], {
  invalid: [
    {
      code: `{
	"gypfile": null
}
`,
      errors: [
        {
          data: {
            error: "the value is `null`, but should be a `boolean`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"gypfile": 123
}
`,
      errors: [
        {
          data: {
            error: "the value should be a `boolean`, not `number`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"gypfile": "true"
}
`,
      errors: [
        {
          data: {
            error: "the value should be a `boolean`, not `string`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"gypfile": {}
}
`,
      errors: [
        {
          data: {
            error: "the value should be a `boolean`, not `object`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
    {
      code: `{
	"gypfile": []
}
`,
      errors: [
        {
          data: {
            error: "the value should be a `boolean`, not `Array`",
          },
          line: 2,
          messageId: "validationError",
        },
      ],
    },
  ],
  valid: ["{}", `{ "gypfile": true }`, `{ "gypfile": false }`],
});
