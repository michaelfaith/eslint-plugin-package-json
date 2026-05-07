import prettier from "prettier";

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  configEmoji: [
    ["recommended", "✅"],
    ["legacy-recommended", "✔️"],
    ["recommended-publishable", "📦"],
    ["stylistic", "🎨"],
  ],
  framework: "starlight",
  pathRuleDoc: "site/src/content/docs/rules/{name}.md",
  pathRuleList: ["README.md", "site/src/content/docs/rule-list.md"],
  postprocess: async (content, path) => {
    const parser = path.endsWith(".mdx") ? "mdx" : "markdown";
    return prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser,
    });
  },
  ruleDocNotices: [
    "configs",
    "deprecated",
    "fixableAndHasSuggestions",
    "requiresTypeChecking",
  ],
  ruleDocTitleFormat: "name",
  urlRuleDoc(name, page) {
    if (page === "README.md") {
      // Use URLs only in the readme.
      return `https://eslint-plugin-package-json.dev/rules/${name}`;
    } else {
      return `/rules/${name}`;
    }
  },
};

export default config;
