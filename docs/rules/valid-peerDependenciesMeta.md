# valid-peerDependenciesMeta

💼 This rule is enabled in the following configs: ✅ `recommended`, 📦 `recommended-publishable`.

<!-- end auto-generated rule header -->

The rule checks that, if present, the `peerDependenciesMeta` property is a validated according the following criteria:

- The value is an object
- Each property's key is a valid package name
- Each property's value is an `object`
- The metadata object for each package should only have the `optional` property
- The value of the `optional` property should be a `boolean`

Example of **incorrect** code for this rule:

```json
{
  "peerDependenciesMeta": {
    "typescript": true
  }
}
```

Example of **correct** code for this rule:

```json
{
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  }
}
```

## See Also

- [npm Documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependenciesmeta)
- [pnpm Documentation](http://pnpm.io/package_json#peerdependenciesmeta)
- [yarn Documentation](https://yarnpkg.com/configuration/manifest#peerDependenciesMeta)
