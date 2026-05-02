# valid-libc

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `libc` property is a string or an Array of strings.

Example of **incorrect** code for this rule:

```json
{
  "libc": {
    "glibc": true
  }
}
```

Example of **correct** code for this rule:

```json
{
  "libc": ["glibc", "musl"]
}
```

```json
{
  "libc": "glibc"
}
```

**See also:** [npm Documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#libc)
