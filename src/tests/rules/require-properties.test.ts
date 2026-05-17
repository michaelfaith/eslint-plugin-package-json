import type { PackageJsonPluginSettings } from "../../createRule.ts";

import { propertyConfig, rules } from "../../rules/require-properties.ts";
import { ruleTester } from "./ruleTester.ts";

const ruleNames = Object.keys(rules);

for (const ruleName of ruleNames) {
  const propertyName = ruleName.replace("require-", "");

  const propertyOptions = propertyConfig.find(
    ([name]) => name === propertyName,
  )?.[1];
  const fixValue = propertyOptions?.fixValue;

  const emitOutputIfFixable = (expectedOutput: string) =>
    fixValue === undefined ? {} : { output: expectedOutput };

  ruleTester.run(ruleName, rules[ruleName], {
    invalid: [
      {
        code: "{}",
        errors: [
          {
            column: 1,
            data: { property: propertyName },
            endColumn: undefined,
            line: 1,
            messageId: "missing",
          },
        ],
        name: "empty object",
        ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)}
}`),
      },
      {
        code: `{
  "foo": "bar",
  "baz": "1.0.0"
}`,
        errors: [
          {
            column: 1,
            data: { property: propertyName },
            endColumn: undefined,
            line: 1,
            messageId: "missing",
          },
        ],
        name: "missing property",
        ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "foo": "bar",
  "baz": "1.0.0"
}`),
      },
      {
        code: `{
  "foo": "bar",
  "baz": "1.0.0",
  "bat": {
    "${propertyName}": "./cli.js"
  }
}`,
        errors: [
          {
            column: 1,
            data: { property: propertyName },
            endColumn: undefined,
            line: 1,
            messageId: "missing",
          },
        ],
        name: "nested property only",
        ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "foo": "bar",
  "baz": "1.0.0",
  "bat": {
    "${propertyName}": "./cli.js"
  }
}`),
      },
      ...(propertyName === "private"
        ? []
        : [
            {
              code: `{
  "private": true
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: true > enforceForPrivate: true",
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": true
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": false
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: false > enforceForPrivate: false",
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": false
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: true > ignorePrivate: false",
              options: [{ ignorePrivate: false }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": true
}`),
            },
            {
              code: `{
  "private": false
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: false > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": false
}`),
            },
            {
              code: `{
  "private": "true"
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: true > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": "true"
}`),
            },
            {
              code: `{}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "empty object > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)}
}`),
            },
            {
              code: `{
  "private": true
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: true > ignorePrivate: false, enforceForPrivate: true",
              options: [{ ignorePrivate: false }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": true
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": false
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: false > ignorePrivate: true, enforceForPrivate: true",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": false
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "empty object > ignorePrivate: true, enforceForPrivate: true",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)}
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: true > ignorePrivate: false, enforceForPrivate: false",
              options: [{ ignorePrivate: false }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": true
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": false
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: false > ignorePrivate: false, enforceForPrivate: false",
              options: [{ ignorePrivate: false }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": false
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": false
}`,
              errors: [
                {
                  column: 1,
                  data: { property: propertyName },
                  endColumn: undefined,
                  line: 1,
                  messageId: "missing",
                },
              ],
              name: "missing property with private: false > ignorePrivate: true, enforceForPrivate: false",
              options: [{ ignorePrivate: true }],
              ...emitOutputIfFixable(`{
  "${propertyName}": ${JSON.stringify(fixValue)},
  "private": false
}`),
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
          ]),
    ],
    valid: [
      `{ "foo": "./index.js", "${propertyName}": "Sophie Trudeau" }`,
      `{ "${propertyName}": "Jessica Moss" }`,
      `{ "${propertyName}": 123 }`,
      `{ "${propertyName}": { "name": "Jessica Moss" } }`,
      ...(propertyName === "private"
        ? []
        : [
            {
              code: `{
  "private": true,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: false",
            },
            {
              code: `{
  "private": true,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: true > enforceForPrivate: true",
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true
}`,
              name: "missing property with private: true > enforceForPrivate: true",
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true
}`,
              name: "missing property with private: true > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
            },
            {
              code: `{
  "private": true,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: true > ignorePrivate: false",
              options: [{ ignorePrivate: false }],
            },
            {
              code: `{
  "private": false,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: false > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
            },
            {
              code: `{
  "private": false,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: false > ignorePrivate: false",
              options: [{ ignorePrivate: false }],
            },
            {
              code: `{
  "private": "true",
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: true > ignorePrivate: true",
              options: [{ ignorePrivate: true }],
            },
            {
              code: `{
  "private": true
}`,
              name: "missing property with private: true > ignorePrivate: true, enforceForPrivate: true",
              options: [{ ignorePrivate: true }],
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: true > ignorePrivate: false, enforceForPrivate: true",
              options: [{ ignorePrivate: false }],
              settings: {
                packageJson: {
                  enforceForPrivate: true,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true
}`,
              name: "missing property with private: true > ignorePrivate: true, enforceForPrivate: false",
              options: [{ ignorePrivate: true }],
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
            {
              code: `{
  "private": true,
  "${propertyName}": "Jessica Moss"
}`,
              name: "with private: true > ignorePrivate: false, enforceForPrivate: false",
              options: [{ ignorePrivate: false }],
              settings: {
                packageJson: {
                  enforceForPrivate: false,
                } satisfies PackageJsonPluginSettings,
              },
            },
          ]),
    ],
  });
}
