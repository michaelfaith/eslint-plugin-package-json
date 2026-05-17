import prettier from 'prettier';

import { rules as requireRules } from './lib/rules/require-properties.mjs';
import { rules as validRules } from './lib/rules/valid-properties.mjs';

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
      return `site/src/content/docs/rules/require-properties/${name}.md`;
    }
    if (validRuleNames.includes(name)) {
      return `site/src/content/docs/rules/valid-properties/${name}.md`;
    }
    return `site/src/content/docs/rules/${name}.md`;
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
