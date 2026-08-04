import {
  validateBin,
  validateBrowser,
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
  validateGypfile,
  validateHomepage,
  validateKeywords,
  validateLibc,
  validateLicense,
  validateMain,
  validateMan,
  validateName,
  validateOs,
  validatePackageManager,
  validatePeerDependenciesMeta,
  validatePrivate,
  validatePublishConfig,
  validateRepository,
  validateScripts,
  validateSideEffects,
  validateType,
  validateVersion,
  validateWorkspaces,
} from 'package-json-validator';
import semver from 'semver';

import {
  createSimpleValidPropertyRule,
  type ValidationFunction,
} from '../utils/createSimpleValidPropertyRule.js';

interface ValidPropertyOptions {
  aliases: string[];
  validator: ValidationFunction;
}

const userAgentRegex = /^(.+?)\/(\S+)?/;

const packageManagerAwareValidateDependencies: ValidationFunction = (value) => {
  const userAgentMatch =
    process.env.npm_config_user_agent?.match(userAgentRegex);

  // Allow for named registries if the user is using pnpm >= 11.1.0.
  // https://github.com/michaelfaith/eslint-plugin-package-json/issues/2057
  if (userAgentMatch?.[1] === 'pnpm') {
    const version = userAgentMatch[2];

    if (!version || semver.gte(version, '11.1.0')) {
      return validateDependencies(value, { allowNamedRegistries: true });
    }
  }

  return validateDependencies(value);
};

// List of all properties we want to create valid- rules for,
// in the format [propertyName, validationFunction | validPropertyOptions]
const properties = [
  ['bin', validateBin],
  ['browser', validateBrowser],
  ['bugs', validateBugs],
  [
    'bundleDependencies',
    {
      aliases: ['bundledDependencies'],
      validator: validateBundleDependencies,
    },
  ],
  ['config', validateConfig],
  ['contributors', validateContributors],
  ['cpu', validateCpu],
  ['description', validateDescription],
  ['dependencies', packageManagerAwareValidateDependencies],
  ['devDependencies', packageManagerAwareValidateDependencies],
  ['devEngines', validateDevEngines],
  ['directories', validateDirectories],
  ['engines', validateEngines],
  ['exports', validateExports],
  ['files', validateFiles],
  ['funding', validateFunding],
  ['gypfile', validateGypfile],
  ['homepage', validateHomepage],
  ['keywords', validateKeywords],
  ['libc', validateLibc],
  ['license', validateLicense],
  ['main', validateMain],
  ['man', validateMan],
  ['module', validateMain], // Reuse `validateMain` for `module`
  ['name', validateName],
  ['optionalDependencies', validateDependencies],
  ['os', validateOs],
  ['packageManager', validatePackageManager],
  ['peerDependencies', validateDependencies],
  ['peerDependenciesMeta', validatePeerDependenciesMeta],
  ['private', validatePrivate],
  ['publishConfig', validatePublishConfig],
  ['repository', validateRepository],
  ['scripts', validateScripts],
  ['sideEffects', validateSideEffects],
  ['type', validateType],
  ['version', validateVersion],
  ['workspaces', validateWorkspaces],
] satisfies [string, ValidationFunction | ValidPropertyOptions][];

/** All basic valid- flavor rules */
export const rules = Object.fromEntries(
  properties.map(([propertyName, validationFunctionOrOptions]) => {
    let validationFunction: ValidationFunction;
    let aliases: string[] = [];
    if (typeof validationFunctionOrOptions === 'object') {
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
