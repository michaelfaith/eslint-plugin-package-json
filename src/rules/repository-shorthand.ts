import type { AST as JsonAST } from 'jsonc-eslint-parser';

import { createRule } from '../createRule.ts';
import { findPropertyWithKeyValue } from '../utils/findPropertyWithKeyValue.ts';
import { isJSONStringLiteral } from '../utils/predicates.ts';

const providerRegexes = {
  bitbucket:
    /^(?:git\+)?(?:ssh:\/\/git@|http?s:\/\/)?(?:www\.)?bitbucket\.org\//,
  gist: /^(?:git\+)?(?:ssh:\/\/git@|http?s:\/\/)?(?:www\.)?gist\.github\.com\//,
  github: /^(?:git\+)?(?:ssh:\/\/git@|http?s:\/\/)?(?:www\.)?github\.com\//,
  gitlab: /^(?:git\+)?(?:ssh:\/\/git@|http?s:\/\/)?(?:www\.)?gitlab\.com\//,
} satisfies Record<string, RegExp>;
type Provider = keyof typeof providerRegexes;

const providerUrls = {
  bitbucket: 'https://bitbucket.org/',
  gist: 'https://gist.github.com/',
  github: 'https://github.com/',
  gitlab: 'https://gitlab.com/',
} satisfies Record<Provider, string>;

const providers = Object.keys(providerRegexes) as Provider[];

const isProvider = (value: string): value is Provider =>
  value in providerRegexes;

const cleanUrl = (url: string, provider: Provider): string =>
  url.replace(providerRegexes[provider], '').replace(/\.git$/, '');

const getProviderFromUrl = (url: string) => {
  return providers.find((provider) => providerRegexes[provider].test(url));
};

const createShorthand = (url: string, provider: Provider): string => {
  const repo = cleanUrl(url, provider);
  return `${provider}:${repo}`;
};

const createUrl = (shorthand: string): string => {
  // Use the appropriate provider url if one is specified
  if (shorthand.includes(':')) {
    const [provider, repo] = shorthand.split(':');
    if (isProvider(provider)) {
      return `${providerUrls[provider]}${repo}`;
    }
  }

  // If the provider is missing or unrecognized, default to GitHub
  return `${providerUrls.github}${shorthand}`;
};

export const rule = createRule({
  create(context) {
    const [{ form = 'object' } = {}] = context.options;

    function validateRepositoryForObject(node: JsonAST.JSONProperty) {
      if (isJSONStringLiteral(node.value)) {
        context.report({
          fix(fixer) {
            if (
              !isJSONStringLiteral(node.value) ||
              node.value.value.split('/').filter(Boolean).length !== 2
            ) {
              return null;
            }

            return fixer.replaceText(
              node.value,
              JSON.stringify(
                {
                  type: 'git',
                  url: createUrl(node.value.value),
                },
                null,
                2,
              ),
            );
          },
          messageId: 'preferObject',
          node: node.value,
        });
      }
    }

    function validateRepositoryForShorthand(node: JsonAST.JSONProperty) {
      if (isJSONStringLiteral(node.value)) {
        const { value } = node.value;
        const provider = getProviderFromUrl(value);
        if (provider) {
          context.report({
            fix(fixer) {
              return fixer.replaceText(
                node.value,
                JSON.stringify(createShorthand(value, provider)),
              );
            },
            messageId: 'preferShorthand',
            node: node.value,
          });
        }

        return;
      }

      if (node.value.type !== 'JSONObjectExpression') {
        return;
      }

      const { properties } = node.value;

      if (findPropertyWithKeyValue(properties, 'directory')) {
        return;
      }

      const typeProperty = findPropertyWithKeyValue(properties, 'type');
      if (
        typeProperty?.value.type !== 'JSONLiteral' ||
        typeProperty.value.value !== 'git'
      ) {
        return;
      }

      const urlProperty = findPropertyWithKeyValue(properties, 'url');

      if (
        urlProperty?.value.type !== 'JSONLiteral' ||
        typeof urlProperty.value.value !== 'string'
      ) {
        return;
      }

      const url = urlProperty.value.value;
      const provider = getProviderFromUrl(url);
      if (provider) {
        context.report({
          fix(fixer) {
            return fixer.replaceText(
              node.value,
              JSON.stringify(createShorthand(url, provider)),
            );
          },
          messageId: 'preferShorthand',
          node: node.value,
        });
      }
    }

    return {
      JSONProperty(node) {
        if (
          node.key.type !== 'JSONLiteral' ||
          node.key.value !== 'repository' ||
          node.parent.parent.parent.type !== 'Program'
        ) {
          return;
        }

        if (form === 'shorthand') {
          validateRepositoryForShorthand(node);
        } else {
          validateRepositoryForObject(node);
        }
      },
    };
  },
  meta: {
    defaultOptions: [{ form: 'object' }],
    docs: {
      category: 'Best Practices',
      description:
        'Enforce either object or shorthand declaration for repository.',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      preferObject: 'Prefer an object locator for a repository.',
      preferShorthand:
        'Prefer a shorthand locator for a supported repository provider.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          form: {
            description: 'Specifies which repository form to enforce.',
            enum: ['object', 'shorthand'],
            type: ['string'],
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'repository-shorthand',
});
