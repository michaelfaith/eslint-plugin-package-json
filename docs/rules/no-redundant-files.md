# no-redundant-files

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule checks that the `files` property of a `package.json` doesn't contain
any redundant or unnecessary file entries. By default, [npm will automatically](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files)
include certain files, based on a number of circumstances.

It will always include the following files, if present:

-   `package.json`
-   `README`
<!-- cspell:disable-next-line -->
-   `LICENSE` / `LICENCE`

Additionally, it will include any files that are declared in the `main` and `bin`
fields of the `package.json`.

This rule will check that the `files` don't contain any of the above. It will
also check for duplicate entries.

Example of **incorrect** code for this rule:

```json
{
	"files": ["README.md", "CHANGELOG.md", "lib/index.js"],
	"main": "lib/index.js"
}
```

Example of **correct** code for this rule:

```json
{
	"files": ["CHANGELOG.md"],
	"main": "lib/index.js"
}
```
