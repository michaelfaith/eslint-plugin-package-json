import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AbbreviatedMetadata } from 'package-json';
import { createSyncFn } from 'synckit';

const require = createRequire(import.meta.url);

/**
 * Given the name of a package, fetch all of the meta data from the registry for that package.
 */
export const fetchPackageMetaFromRegistry = createSyncFn<
  (name: string) => Promise<AbbreviatedMetadata>
>(getWorkerPath(), {
  timeout: 10_000,
});

/**
 * Get the worker module path.
 */
function getWorkerPath(): string {
  const ext = path.extname(import.meta.filename);

  try {
    return fileURLToPath(import.meta.resolve(`./worker${ext}`));
  } catch {
    // ignore
  }

  return require.resolve(`./worker${ext}`);
}
