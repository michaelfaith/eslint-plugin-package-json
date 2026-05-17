import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/tests/**/*'],
  outDir: 'lib',
  unbundle: true,
});
