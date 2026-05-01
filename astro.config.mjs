// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightCatppuccin from "@catppuccin/starlight";

const site = "https://esling-plugin-package-json.dev";

export default defineConfig({
  integrations: [
    starlight({
      title: "ESLint Plugin: Package JSON",
      logo: {
        dark: "./src/assets/logo/logo-dark.svg",
        light: "./src/assets/logo/logo-light.svg",
      },
      favicon: "/images/favicon.svg",
      plugins: [starlightCatppuccin()],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/michaelfaith/eslint-plugin-package-json",
        },
      ],
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
  prefetch: {
    defaultStrategy: "hover",
  },
  experimental: {
    clientPrerender: true,
  },
  server: {
    port: 3000,
  },
  publicDir: "./site/public",
  srcDir: "./site/src",
  root: "./site",
  outDir: "./dist-site",
  site,
});
