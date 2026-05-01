import {
  validateAuthor,
  validateBin,
  validateBugs,
  validateBundleDependencies,
  validateConfig,
  validateContributors,
  validateCpu,
  validateDependencies,
  validateDescription,
  validateDevEngines,
  validateDirectories,
  validateEngines,
  validateExports,
  validateFiles,
  validateFunding,
  validateHomepage,
  validateKeywords,
  validateLicense,
  validateMain,
  validateMan,
  validateOs,
  validatePackageManager,
  validatePeerDependenciesMeta,
  validatePrivate,
  validatePublishConfig,
  validateRepository,
  validateScripts,
  validateSideEffects,
  validateType,
  validateWorkspaces,
} from "package-json-validator";

import {
  createSimpleValidPropertyRule,
  type ValidationFunction,
} from "../utils/createSimpleValidPropertyRule.js";

interface ValidPropertyOptions {
  aliases: string[];
  validator: ValidationFunction;
}

// List of all properties we want to create valid- rules for,
// in the format [propertyName, validationFunction | validPropertyOptions]
const properties = [
  ["author", validateAuthor],
  ["bin", validateBin],
  ["bugs", validateBugs],
  [
    "bundleDependencies",
    {
      aliases: ["bundledDependencies"],
      validator: validateBundleDependencies,
    },
  ],
  ["config", validateConfig],
  ["contributors", validateContributors],
  ["cpu", validateCpu],
  ["description", validateDescription],
  ["dependencies", validateDependencies],
  ["devDependencies", validateDependencies],
  ["devEngines", validateDevEngines],
  ["directories", validateDirectories],
  ["engines", validateEngines],
  ["exports", validateExports],
  ["files", validateFiles],
  ["funding", validateFunding],
  ["homepage", validateHomepage],
  ["keywords", validateKeywords],
  ["license", validateLicense],
  ["main", validateMain],
  ["man", validateMan],
  ["module", validateMain], // Reuse `validateMain` for `module`
  ["optionalDependencies", validateDependencies],
  ["os", validateOs],
  ["packageManager", validatePackageManager],
  ["peerDependencies", validateDependencies],
  ["peerDependenciesMeta", validatePeerDependenciesMeta],
  ["private", validatePrivate],
  ["publishConfig", validatePublishConfig],
  ["repository", validateRepository],
  ["scripts", validateScripts],
  ["sideEffects", validateSideEffects],
  ["type", validateType],
  ["workspaces", validateWorkspaces],
] satisfies [string, ValidationFunction | ValidPropertyOptions][];

/** All basic valid- flavor rules */
export const rules = Object.fromEntries(
  properties.map(([propertyName, validationFunctionOrOptions]) => {
    let validationFunction: ValidationFunction;
    let aliases: string[] = [];
    if (typeof validationFunctionOrOptions === "object") {
      validationFunction = validationFunctionOrOptions.validator;
      aliases = validationFunctionOrOptions.aliases;
    } else {
      validationFunction = validationFunctionOrOptions;
    }
    const { rule, ruleName } = createSimpleValidPropertyRule(
      propertyName,
      validationFunction,
      aliases,
    );
    return [ruleName, rule];
  }),
);
