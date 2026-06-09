import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import starlightCatppuccin from '@catppuccin/starlight';
import { defineConfig } from 'astro/config';
import starlightAutoSidebar from 'starlight-auto-sidebar';

const site = 'https://eslint-plugin-package-json.dev';

export default defineConfig({
  experimental: {
    clientPrerender: true,
  },
  integrations: [
    starlight({
      components: {
        Head: './src/components/Head.astro',
      },
      favicon: '/images/favicon.svg',
      logo: {
        dark: './src/assets/logo/logo-dark.svg',
        light: './src/assets/logo/logo-light.svg',
      },
      plugins: [starlightAutoSidebar(), starlightCatppuccin()],
      sidebar: [
        { label: 'Getting Started', slug: 'getting-started' },
        { label: 'Rule List', slug: 'rule-list' },
        {
          collapsed: true,
          items: [{ autogenerate: { collapsed: true, directory: 'rules' } }],
          label: 'Rules',
        },
        {
          collapsed: true,
          items: [
            {
              autogenerate: { collapsed: true, directory: 'getting-involved' },
            },
          ],
          label: 'Getting Involved',
        },
      ],
      social: [
        {
          href: 'https://github.com/michaelfaith/eslint-plugin-package-json',
          icon: 'github',
          label: 'GitHub',
        },
      ],
      title: 'ESLint Plugin: Package JSON',
    }),
  ],
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
  outDir: './dist-site',
  prefetch: {
    defaultStrategy: 'hover',
  },
  publicDir: './site/public',
  root: './site',
  server: {
    port: 3000,
  },
  site,
  srcDir: './site/src',
});
