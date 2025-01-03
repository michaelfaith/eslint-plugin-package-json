import { createRequire } from "node:module";

import type { PackageJsonRuleModule } from "./createRule.js";

import { rule as noRedundantFiles } from "./rules/no-redundant-files.js";
import { rule as orderProperties } from "./rules/order-properties.js";
import { rule as preferRepositoryShorthand } from "./rules/repository-shorthand.js";
import { rule as sortCollections } from "./rules/sort-collections.js";
import { rule as uniqueDependencies } from "./rules/unique-dependencies.js";
import { rule as validLocalDependency } from "./rules/valid-local-dependency.js";
import { rule as validName } from "./rules/valid-name.js";
import { rule as validPackageDefinition } from "./rules/valid-package-definition.js";
import { rule as validRepositoryDirectory } from "./rules/valid-repository-directory.js";
import { rule as validVersion } from "./rules/valid-version.js";

const require = createRequire(import.meta.url || __filename);

const { name, version } = require("../package.json") as {
	name: string;
	version: string;
};

const rules: Record<string, PackageJsonRuleModule> = {
	"no-redundant-files": noRedundantFiles,
	"order-properties": orderProperties,
	"repository-shorthand": preferRepositoryShorthand,
	"sort-collections": sortCollections,
	"unique-dependencies": uniqueDependencies,
	"valid-local-dependency": validLocalDependency,
	"valid-name": validName,
	/** @deprecated use 'valid-package-definition' instead */
	"valid-package-def": {
		...validPackageDefinition,
		meta: {
			...validPackageDefinition.meta,
			deprecated: true,
			docs: {
				...validPackageDefinition.meta.docs,
				recommended: false,
			},
			replacedBy: ["valid-package-definition"],
		},
	},
	"valid-package-definition": validPackageDefinition,
	"valid-repository-directory": validRepositoryDirectory,
	"valid-version": validVersion,
};

export const plugin = {
	meta: {
		name,
		version,
	},
	rules,
};

export const recommendedRuleSettings = Object.fromEntries(
	Object.entries(rules)
		.filter(([, rule]) => rule.meta.docs?.recommended)
		.map(([name]) => ["package-json/" + name, "error" as const]),
);
