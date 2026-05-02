# valid-browser

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

This rule checks that the `browser` property is a non-empty string.

Example of **incorrect** code for this rule:

```json
{
  "browser": ["index.umd.js", "secondary.umd.js"]
}
```

Example of **correct** code for this rule:

```json
{
  "browser": "index.umd.js"
}
```
