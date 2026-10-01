import { defineConfig } from 'tsdown';

export default defineConfig({
  attw: {
    enabled: 'ci-only',
    level: 'error',
    profile: 'esm-only',
  },
  entry: ['src/index.ts', 'src/experimental/index.ts'],
});
