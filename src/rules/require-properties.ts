import {
  type CreateRequirePropertyRuleOptions,
  createSimpleRequirePropertyRule,
} from "../utils/createSimpleRequirePropertyRule.js";

export const propertyConfig: [
  name: string,
  options?: CreateRequirePropertyRuleOptions,
][] = [
  ["author"],
  ["bin"],
  ["bugs", { ignorePrivateDefault: true }],
  ["bundleDependencies"],
  ["config"],
  ["contributors"],
  ["cpu"],
  ["dependencies"],
  ["description", { isRecommended: true }],
  ["devDependencies"],
  ["devEngines"],
  ["directories"],
  ["engines"],
  ["exports", { ignorePrivateDefault: true, isRecommended: true }],
  ["files", { ignorePrivateDefault: true, isRecommended: true }],
  ["funding"],
  ["gypfile"],
  ["homepage", { ignorePrivateDefault: true }],
  ["keywords", { ignorePrivateDefault: true }],
  ["license", { ignorePrivateDefault: true, isRecommended: true }],
  ["main"],
  ["man"],
  ["module"],
  ["name", { ignorePrivateDefault: true, isRecommended: true }],
  ["optionalDependencies"],
  ["os"],
  ["packageManager"],
  ["peerDependencies"],
  ["private", { fixValue: false }],
  ["publishConfig", { ignorePrivateDefault: true }],
  ["repository", { ignorePrivateDefault: true, isRecommended: true }],
  ["scripts"],
  ["sideEffects", { ignorePrivateDefault: true, isRecommended: true }],
  ["type", { fixValue: "commonjs", isRecommended: true }],
  ["types"],
  ["version", { ignorePrivateDefault: true, isRecommended: true }],
];

export const rules = Object.fromEntries(
  propertyConfig.map(([propertyName, options]) => {
    const { rule, ruleName } = createSimpleRequirePropertyRule(
      propertyName,
      options,
    );
    return [ruleName, rule];
  }),
);
