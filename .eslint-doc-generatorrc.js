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
    // This is a hacky workaround to convert the built-in header format of "# desc (name)" to a
    // YAML frontmatter with title and description fields that works with starlight.
    // This is only necessary until https://github.com/eslint-community/eslint-doc-generator/issues/941 is implemented.
    let output = content;

    // Don't manipulate the readme or rule list, since they have custom content and formatting.
    // if (!(path.endsWith("README.md") || path.endsWith("rule-list.md"))) {
    //   const lines = output.split("\n");
    //   const dashesLineIndex1 = lines.indexOf("---");
    //   const dashesLineIndex2 = lines.indexOf("---", dashesLineIndex1 + 1);
    //   const titleLineIndex = lines.findIndex((line) => line.startsWith("# "));
    //   const headerRegex = /^# (.+) \(`(.+)`\)$/;
    //   const match =
    //     titleLineIndex !== -1 ? lines[titleLineIndex].match(headerRegex) : null;
    //   const newHeaderLines = ["---"];
    //   if (match) {
    //     const [, desc, name] = match;
    //     newHeaderLines.push(`title: ${name}`);
    //     newHeaderLines.push(`description: ${desc}`);
    //   }
    //   newHeaderLines.push("---");
    //   if (dashesLineIndex2 > 0) {
    //     lines.splice(
    //       dashesLineIndex1,
    //       titleLineIndex - dashesLineIndex1 + 1,
    //       ...newHeaderLines,
    //     );
    //   } else {
    //     lines.splice(0, titleLineIndex + 1, ...newHeaderLines);
    //   }
    //   output = lines.join("\n");
    // }

    const parser = path.endsWith(".mdx") ? "mdx" : "markdown";
    return prettier.format(output, {
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
