import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    worker: 'src/utils/packageMeta/worker.ts',
    'experimental/index': 'src/experimental/index.ts',
    'experimental/worker': 'src/utils/packageMeta/worker.ts',
  },
});
