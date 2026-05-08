import starlight from "@astrojs/starlight";
import starlightCatppuccin from "@catppuccin/starlight";
import { defineConfig } from "astro/config";

const site = "https://esling-plugin-package-json.dev";

export default defineConfig({
  experimental: {
    clientPrerender: true,
  },
  integrations: [
    starlight({
      components: {
        Head: "./src/components/Head.astro",
      },
      favicon: "/images/favicon.svg",
      logo: {
        dark: "./src/assets/logo/logo-dark.svg",
        light: "./src/assets/logo/logo-light.svg",
      },
      plugins: [starlightCatppuccin()],
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
        { label: "Rule List", slug: "rule-list" },
        {
          autogenerate: { directory: "rules" },
          collapsed: true,
          label: "Rules",
        },
      ],
      social: [
        {
          href: "https://github.com/michaelfaith/eslint-plugin-package-json",
          icon: "github",
          label: "GitHub",
        },
      ],
      title: "ESLint Plugin: Package JSON",
    }),
  ],
  outDir: "./dist-site",
  prefetch: {
    defaultStrategy: "hover",
  },
  publicDir: "./site/public",
  root: "./site",
  server: {
    port: 3000,
  },
  site,
  srcDir: "./site/src",
});
