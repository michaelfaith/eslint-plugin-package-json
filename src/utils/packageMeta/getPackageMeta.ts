import { createRequire } from 'node:module';
import path from 'node:path';

import npa from 'npm-package-arg';
import semver from 'semver';

import type { PackageJsonRuleContext } from '../../createRule.ts';
import { getSemverRange } from '../semver/getSemverRange.ts';
import { getCache, writeCache, type CachePayload } from './cache.ts';
import { fetchPackageMetaFromRegistry } from './fetchPackageMetaFromRegistry.ts';
import {
  isPackageMeta,
  type PackageMeta,
  type RemotePackageMeta,
} from './PackageMeta.ts';

/**
 * Retrieve a package's package.json from the installed node_modules.
 */
export const getInstalledPackageMeta = (
  name: string,
  version: string,
  ruleContext: PackageJsonRuleContext,
): PackageMeta | null => {
  try {
    const origin = ruleContext.filename;
    const dummyPath = path.join(path.dirname(origin), '__dummy__.js');
    const require = createRequire(dummyPath);
    const packageJsonPath = require.resolve(`${name}/package.json`);
    const packageJson: unknown = require(packageJsonPath);

    if (isPackageMeta(packageJson)) {
      const versionRange = getSemverRange(version);
      if (
        typeof packageJson.version === 'string' &&
        (!versionRange || semver.satisfies(packageJson.version, versionRange))
      ) {
        packageJson._origin = packageJsonPath;
        return packageJson;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

export interface RefreshableRemotePackageMeta {
  cache: RemotePackageMeta[];
  get: () => RemotePackageMeta[] | null;
}

/**
 * Retrieve a package's meta data from the npm registry.
 */
export const getRemotePackageMeta = (
  name: string,
  rawVersion: string,
): RefreshableRemotePackageMeta => {
  const version = rawVersion.trim();
  if (version.startsWith('npm:')) {
    let parsed: npa.Result | null = null;
    try {
      parsed = npa(version.slice(4).trim());
    } catch {
      // absorb
    }
    if (
      parsed &&
      (parsed.type === 'range' ||
        parsed.type === 'version' ||
        parsed.type === 'tag')
    ) {
      return getPackageMetaFromNameAndSpec(
        parsed.name ?? name,
        parsed.fetchSpec?.trim(),
      );
    }
  }
  if (version.includes('/') || version.includes(':')) {
    // unknown
    return { cache: [], get: () => [] };
  }

  return getPackageMetaFromNameAndSpec(name, version);
};

/**
 * Get the package meta data from npm registry given the package's name and spec.
 */
const getPackageMetaFromNameAndSpec = (
  name: string,
  rawVersionOrTag: string | undefined,
): RefreshableRemotePackageMeta => {
  const cacheFileName = `${name.replaceAll('/', '-')}.json`;
  const { cache, get } = getPackageMetaFromName(name, cacheFileName);

  let isTargetVersion: (meta: RemotePackageMeta) => boolean;

  let hasUnknown = false;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- handling empty string
  const versionOrTag = rawVersionOrTag || '*';
  const range = getSemverRange(versionOrTag);
  if (range) {
    isTargetVersion = (packageMeta) => {
      if (!packageMeta.version) {
        return true;
      }
      return range.test(packageMeta.version);
    };
  } else {
    const parsed = npa.resolve(name, versionOrTag);
    if (parsed.type === 'tag') {
      isTargetVersion = (packageMeta) => {
        if (!packageMeta.version) {
          return true;
        }
        const v = packageMeta['dist-tags']?.[parsed.fetchSpec];
        if (v == null) {
          hasUnknown = true;
        }
        return v === packageMeta.version;
      };
    } else {
      return {
        cache: [],
        get: () => null,
      };
    }
  }

  if (cache) {
    let isCacheActive = cache.isActive;
    // If the cache has expired, but we have all versions that could possibly fit
    // within the range that this package is requesting, then the getter doesn't need to refetch
    if (!isCacheActive && range) {
      isCacheActive = cache.content.data.some(
        (packageMeta) =>
          packageMeta.version && semver.gtr(packageMeta.version, range),
      );
    }

    const metaList = cache.content.data.filter(isTargetVersion);
    if (isCacheActive) {
      return {
        cache: metaList,
        get: () => (hasUnknown ? null : metaList),
      };
    }
    return {
      cache: metaList,
      get: () => {
        const list = get()?.filter(isTargetVersion) ?? null;
        return hasUnknown && !list?.length ? null : list;
      },
    };
  }
  return {
    cache: [],
    get: () => {
      const list = get()?.filter(isTargetVersion) ?? null;
      return hasUnknown && !list?.length ? null : list;
    },
  };
};

interface RefreshableRemotePackageMetaCachePayload {
  cache: CachePayload | null;
  get: () => RemotePackageMeta[] | null;
}

/**
 * Get all of the package meta from the registry using the given package name.
 */
const getPackageMetaFromName = (
  name: string,
  cacheFileName: string,
): RefreshableRemotePackageMetaCachePayload => {
  const cache = getCache(cacheFileName);

  return {
    cache,
    get: () => getPackageMetaFromNameWithoutCache(name, cacheFileName),
  };
};

/**
 * Get all of the package meta directly from the registry using the given package name,
 * and write to cache.
 */
const getPackageMetaFromNameWithoutCache = (
  name: string,
  cacheFileName: string,
): RemotePackageMeta[] | null => {
  let packageMeta: RemotePackageMeta[];
  try {
    // const start = performance.now()
    const allMeta = fetchPackageMetaFromRegistry(name);
    // const end = performance.now()
    // console.log(name, `${end - start}ms`)

    packageMeta = Object.values(allMeta.versions).map(
      (meta): RemotePackageMeta => ({
        version: meta.version,
        engines: meta.engines,
        dependencies: meta.dependencies,
        peerDependencies: meta.peerDependencies,
        optionalDependencies: meta.optionalDependencies,
        'dist-tags': allMeta['dist-tags'],
        deprecated: meta.deprecated,
      }),
    );
  } catch {
    return null;
  }

  writeCache(cacheFileName, packageMeta);
  return packageMeta;
};
