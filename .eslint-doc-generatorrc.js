import prettier from 'prettier';

import { rules } from './dist/index.mjs';

const ruleEntries = Object.entries(rules);
const requireRules = Object.fromEntries(
  ruleEntries.filter(
    ([, rule]) => rule.meta.docs.ruleGroup === 'require-properties',
  ),
);
const validRules = Object.fromEntries(
  ruleEntries.filter(
    ([, rule]) => rule.meta.docs.ruleGroup === 'valid-properties',
  ),
);

const requireRuleNames = Object.keys(requireRules);
const validRuleNames = Object.keys(validRules);

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  configEmoji: [
    ['recommended', '✅'],
    ['recommended-publishable', '📦'],
    ['stylistic', '🎨'],
  ],
  framework: 'starlight',
  pathRuleDoc(name) {
    // Group the simple require-* and valid-* rules into their own sections.
    if (requireRuleNames.includes(name)) {
      return `site/src/content/docs/rules/require-properties/${name}.mdx`;
    }
    if (validRuleNames.includes(name)) {
      return `site/src/content/docs/rules/valid-properties/${name}.mdx`;
    }
    return `site/src/content/docs/rules/${name}.mdx`;
  },
  pathRuleList: ['README.md', 'site/src/content/docs/rule-list.md'],
  postprocess: async (content, path) => {
    const parser = path.endsWith('.mdx') ? 'mdx' : 'markdown';
    return prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser,
    });
  },
  ruleDocNotices: [
    'configs',
    'deprecated',
    'fixableAndHasSuggestions',
    'requiresTypeChecking',
  ],
  ruleDocTitleFormat: 'name',
  ruleListSplit(rules) {
    return [
      {
        // No header for this list.
        rules: rules.filter(
          ([name]) =>
            !requireRuleNames.includes(name) && !validRuleNames.includes(name),
        ),
      },
      {
        title: 'Require Properties',
        rules: rules.filter(([name]) => requireRuleNames.includes(name)),
        description:
          'This group of rules allows you to require that the associated top-level property must be present in the `package.json`.',
      },
      {
        title: 'Valid Properties',
        rules: rules.filter(([name]) => validRuleNames.includes(name)),
        description:
          'This group of rules allows you to enforce that the value of the associated top-level property is valid.  All of these rules are include in the `recommended` config.',
      },
    ];
  },
  urlRuleDoc(name, page) {
    // Group the simple require-* and valid-* rules into their own sections.
    let rulePath = `rules/${name}`;
    if (requireRuleNames.includes(name)) {
      rulePath = `rules/require-properties/${name}`;
    }
    if (validRuleNames.includes(name)) {
      rulePath = `rules/valid-properties/${name}`;
    }

    if (page === 'README.md') {
      // Use URLs only in the readme.
      return `https://eslint-plugin-package-json.dev/${rulePath}`;
    } else {
      return `/${rulePath}`;
    }
  },
};

export default config;
