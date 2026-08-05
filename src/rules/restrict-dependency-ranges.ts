import type { AST } from 'jsonc-eslint-parser';
import semver from 'semver';

import { createRule } from '../createRule.ts';
import { isJSONStringLiteral } from '../utils/predicates/index.ts';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

const RANGE_TYPES = [
  { symbol: '^', alias: 'caret' },
  { alias: 'pin', workspaceSymbol: '*' },
  { symbol: '~', alias: 'tilde' },
  { symbol: '<', alias: 'lt' },
  { symbol: '<=', alias: 'le' },
  { symbol: '>', alias: 'gt' },
  { symbol: '>=', alias: 'ge' },
] as const;
type RangeType = (typeof RANGE_TYPES)[number];

const SYMBOLS = RANGE_TYPES.filter((rangeType) => 'symbol' in rangeType).map(
  (rangeType) => rangeType.symbol,
);
type RangeSymbol = (typeof SYMBOLS)[number];

const RANGE_NAMES = RANGE_TYPES.map((rangeType) => rangeType.alias);
type RangeName = (typeof RANGE_NAMES)[number];

const SYMBOLS_AND_RANGE_NAMES = [...SYMBOLS, ...RANGE_NAMES];

const schemaOptions = {
  additionalProperties: false,
  properties: {
    forDependencyTypes: {
      description:
        'Apply a range type restriction for an entire group of dependencies by which type of dependencies they belong to.',
      items: {
        enum: DEPENDENCY_TYPES,
      },
      type: 'array',
    },
    forPackages: {
      description:
        'The exact name of a package, or a regex pattern used to match a group of packages by name.',
      items: {
        type: 'string',
      },
      type: 'array',
    },
    forVersions: {
      description: 'Apply a restriction to a specific semver range.',
      type: 'string',
    },
    rangeType: {
      description:
        'Identifies which range type or types you want to apply to packages that match any of the other match options (or all dependencies if no other options are provided).',
      oneOf: [
        {
          enum: SYMBOLS_AND_RANGE_NAMES,
        },
        {
          items: {
            enum: SYMBOLS_AND_RANGE_NAMES,
          },
          type: 'array',
        },
      ],
    },
  },
  required: ['rangeType'],
  type: 'object',
} as const;

const normalizeRangeType = (
  rangeTypeOrSymbol: RangeName | RangeSymbol,
): RangeType =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- validated by JSON schema
  RANGE_TYPES.find(
    (rangeType) =>
      ('symbol' in rangeType && rangeType.symbol === rangeTypeOrSymbol) ||
      rangeType.alias === rangeTypeOrSymbol,
  )!;

const workspaceVersionStartsWith = (rangeType: RangeType) => {
  if ('workspaceSymbol' in rangeType) {
    return `workspace:${rangeType.workspaceSymbol}`;
  }
  return `workspace:${rangeType.symbol}`;
};

/** For displaying a range type in a user-facing way (ie. an error message). */
const displayRangeType = (rangeType: RangeType) =>
  'symbol' in rangeType ? rangeType.symbol : rangeType.alias;

/**
 * Given the original version, update it to use the correct range type.
 */
const changeVersionRange = (version: string, rangeType: RangeType): string => {
  // We need to handle workspace versions with only the range indicator,
  // slightly differently
  if (/^workspace:[~^*]$/.test(version)) {
    return workspaceVersionStartsWith(rangeType);
  }

  const replaceWith = 'symbol' in rangeType ? rangeType.symbol : '';
  return version.replace(/^(workspace:)?(\^|~|<=?|>=?)?/, `$1${replaceWith}`);
};

/**
 * Check if the version is in a form that this rule supports.
 */
const isVersionSupported = (version: string): boolean => {
  if (/^workspace:[*^~]$/.test(version)) {
    return true;
  }
  const rawVersion = version.replace(/^workspace:/, '');
  return !!semver.validRange(rawVersion);
};

export const rule = createRule({
  create(context) {
    // Bail early if no options were provided
    if (!context.options[0]) {
      return {};
    }

    // Reverse the array, so that subsequent options override previous ones
    const optionsProvided = Array.isArray(context.options[0])
      ? context.options[0].toReversed()
      : [context.options[0]];

    const optionsArray = optionsProvided.map((option) => ({
      ...option,
      forPackages: option.forPackages?.map((pattern) => new RegExp(pattern)),
      rangeTypes: Array.isArray(option.rangeType)
        ? option.rangeType
        : [option.rangeType],
    }));

    return {
      'Program > JSONExpressionStatement > JSONObjectExpression > JSONProperty[key.type=JSONLiteral][value.type=JSONObjectExpression]'(
        node: AST.JSONProperty & {
          key: AST.JSONStringLiteral;
          value: AST.JSONObjectExpression;
        },
      ) {
        const dependencyType = node.key.value;

        // If this isn't a group of dependencies, skip it entirely
        if (!DEPENDENCY_TYPES.includes(dependencyType)) {
          return;
        }

        // Loop through all dependencies in the group
        for (const property of node.value.properties) {
          // If either the key or value aren't strings, this isn't a valid dependency, so move on.
          if (
            !isJSONStringLiteral(property.key) ||
            !isJSONStringLiteral(property.value)
          ) {
            continue;
          }

          const name = property.key.value;
          const version = property.value.value;

          // Check to see if the version is in a format we support
          if (!isVersionSupported(version)) {
            continue;
          }

          const doesRangeTypeMatch = (rangeType: RangeType) => {
            if ('symbol' in rangeType) {
              if (semver.validRange(version)) {
                return version.startsWith(rangeType.symbol);
              }
            } else {
              // when rangeType is pin
              return !!semver.parse(version) || version === 'workspace:*';
            }
            return version.startsWith(workspaceVersionStartsWith(rangeType));
          };

          // Loop through all options, and evaluate each of them for this dependency
          for (const options of optionsArray) {
            // Skip these options if they have any conditions that match
            // the current dependency.
            if (
              options.forDependencyTypes &&
              !options.forDependencyTypes.includes(dependencyType)
            ) {
              continue;
            }
            if (options.forPackages) {
              const isMatch = options.forPackages.some((packageNameRegex) =>
                packageNameRegex.test(name),
              );
              if (!isMatch) {
                continue;
              }
            }
            if (
              options.forVersions &&
              // We can't determine whether any workspace version without a numeric version to accompany it, matches this range
              // so we'll just skip it.
              (/^workspace:[^~*]?$/.test(version) ||
                // * matches all
                (version !== '*' &&
                  !semver.satisfies(
                    version.replace(/(?:workspace:)?[^~]?/, ''),
                    options.forVersions,
                  )))
            ) {
              continue;
            }

            // We've matched this set of options, so we should check
            // the range type.
            const rangeTypes = options.rangeTypes.map(normalizeRangeType);

            const validRangeTypes = rangeTypes.map(displayRangeType).join(', ');

            // If the version is just '*', then this is definitely in violation,
            // and we can report immediately.
            if (version === '*') {
              context.report({
                data: {
                  rangeTypes: validRangeTypes,
                },
                messageId: 'wrongRangeType',
                node: property.value,
              });
              break;
            }

            const isRangeTypeValid = rangeTypes.some(doesRangeTypeMatch);

            // If we didn't match what's in the options, we need to report an error.
            if (!isRangeTypeValid) {
              context.report({
                data: {
                  rangeTypes: validRangeTypes,
                },
                messageId: 'wrongRangeType',
                node: property.value,
                suggest: rangeTypes.map((rangeType) => ({
                  fix(fixer) {
                    return fixer.replaceText(
                      property.value,
                      `"${changeVersionRange(version, rangeType)}"`,
                    );
                  },
                  messageId:
                    rangeType.alias === 'pin' ? 'changeToPin' : 'changeTo',
                  data:
                    rangeType.alias === 'pin'
                      ? undefined
                      : {
                          rangeType: displayRangeType(rangeType),
                        },
                })),
              });
            }

            // Since this option matched the current dependency, and it's the last
            // one in the array, it takes precedent over any preceding
            // matching options.  So, no need to process more.
            break;
          }
        }
      },
    };
  },
  meta: {
    defaultOptions: [[]],
    docs: {
      description:
        'Restricts the range of dependencies to allow or disallow specific types of ranges.',
    },
    hasSuggestions: true,
    messages: {
      changeToPin: 'Pin the version.',
      changeTo: 'Change to use a {{rangeType}} range',
      wrongRangeType:
        'This dependency is using the wrong range type.  Acceptable range type(s): {{rangeTypes}}',
    },
    schema: [
      {
        oneOf: [
          schemaOptions,
          {
            description:
              'Array of configuration options, specifying range requirements.',
            items: schemaOptions,
            type: 'array',
          },
        ],
      },
    ],
    type: 'suggestion',
  },
  name: 'restrict-dependency-ranges',
});
