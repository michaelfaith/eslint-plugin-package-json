import type * as npaModule from 'npm-package-arg';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PackageJsonRuleContext } from '../../createRule.ts';
import type { CachePayload } from './cache.ts';
import {
  getInstalledPackageMeta,
  getRemotePackageMeta,
} from './getPackageMeta.ts';
import type { RemotePackageMeta } from './PackageMeta.ts';

const {
  createRequireMock,
  requireMock,
  resolveMock,
  getCacheMock,
  writeCacheMock,
  fetchMock,
  npaMock,
  npaResolveMock,
} = vi.hoisted(() => {
  const resolve = vi.fn();
  const require = Object.assign(vi.fn(), { resolve });
  return {
    createRequireMock: vi.fn(() => require),
    requireMock: require,
    resolveMock: resolve,
    getCacheMock: vi.fn(),
    writeCacheMock: vi.fn(),
    fetchMock: vi.fn(),
    npaMock: vi.fn(),
    npaResolveMock: vi.fn(),
  };
});

vi.mock('node:module', () => ({ createRequire: createRequireMock }));
vi.mock('npm-package-arg', async () => {
  const actual = await vi.importActual<typeof npaModule>('npm-package-arg');
  npaMock.mockImplementation(actual.default);
  npaResolveMock.mockImplementation(actual.default.resolve);
  return {
    default: Object.assign(npaMock, { resolve: npaResolveMock }),
  };
});
vi.mock('./cache.ts', () => ({
  getCache: getCacheMock,
  writeCache: writeCacheMock,
}));
vi.mock('./fetchPackageMetaFromRegistry.ts', () => ({
  fetchPackageMetaFromRegistry: fetchMock,
}));

const filename = '/project/package.json';
const ruleContext = { filename } as PackageJsonRuleContext;
const packageMeta: RemotePackageMeta = {
  version: '1.2.3',
  engines: { node: '>=22' },
  dependencies: { dependency: '^1.0.0' },
  peerDependencies: undefined,
  optionalDependencies: undefined,
  deprecated: undefined,
  'dist-tags': { latest: '1.2.3' },
};

const cache = (data: RemotePackageMeta[], isActive = true): CachePayload => ({
  content: { data, expiration: 0, timestamp: 0 },
  isActive,
});

describe('getPackageMeta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCacheMock.mockReturnValue(null);
    resolveMock.mockReturnValue('/project/node_modules/package-a/package.json');
    requireMock.mockReturnValue({ ...packageMeta });
    fetchMock.mockReturnValue({
      'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
      versions: {
        '1.2.3': {
          ...packageMeta,
          version: '1.2.3',
        },
        '2.0.0-beta.1': {
          version: '2.0.0-beta.1',
          engines: undefined,
          dependencies: undefined,
          peerDependencies: { peer: '^1.0.0' },
          optionalDependencies: { optional: '^1.0.0' },
          deprecated: 'use another version',
        },
      },
    });
  });

  describe(getInstalledPackageMeta, () => {
    it('returns matching installed metadata and records its origin', () => {
      const result = getInstalledPackageMeta(
        'package-a',
        '^1.0.0',
        ruleContext,
      );

      expect(result).toEqual({
        ...packageMeta,
        _origin: '/project/node_modules/package-a/package.json',
      });
    });

    it.each([
      ['an unsatisfied version', '2.0.0', { ...packageMeta, version: '1.2.3' }],
      ['a missing version', '*', { ...packageMeta, version: undefined }],
      ['a non-string version', '*', { ...packageMeta, version: 1.2 }],
      ['invalid metadata', '*', null],
    ])('returns null for %s', (_reason, version, installedMeta) => {
      requireMock.mockReturnValue(installedMeta);

      expect(
        getInstalledPackageMeta('package-a', version, ruleContext),
      ).toBeNull();
    });

    it('accepts an exact version and an unparsable requested range', () => {
      expect(
        getInstalledPackageMeta('package-a', '1.2.3', ruleContext),
      ).not.toBeNull();
      expect(
        getInstalledPackageMeta('package-a', 'not-a-range', ruleContext),
      ).not.toBeNull();
    });

    it('returns null when resolution or loading fails', () => {
      resolveMock.mockImplementation(() => {
        throw new Error('not installed');
      });

      expect(getInstalledPackageMeta('package-a', '*', ruleContext)).toBeNull();
    });
  });

  describe(getRemotePackageMeta, () => {
    it('trims a semver range, filters registry metadata, and writes the mapped cache', () => {
      const result = getRemotePackageMeta('package-a', ' ^1.0.0 ');

      expect(result.cache).toEqual([]);
      expect(result.get()).toEqual([
        {
          ...packageMeta,
          version: '1.2.3',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
      expect(writeCacheMock).toHaveBeenCalledWith('package-a.json', [
        {
          ...packageMeta,
          version: '1.2.3',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
        {
          version: '2.0.0-beta.1',
          engines: undefined,
          dependencies: undefined,
          peerDependencies: { peer: '^1.0.0' },
          optionalDependencies: { optional: '^1.0.0' },
          deprecated: 'use another version',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
    });

    it('returns null when fetching fails', () => {
      fetchMock.mockImplementation(() => {
        throw new Error('offline');
      });

      const result = getRemotePackageMeta('package-a', '1.2.3');

      expect(result.get()).toBeNull();
    });

    it('filters by a dist-tag', () => {
      const result = getRemotePackageMeta('package-a', 'beta');

      expect(result.get()).toEqual([
        {
          version: '2.0.0-beta.1',
          engines: undefined,
          dependencies: undefined,
          peerDependencies: { peer: '^1.0.0' },
          optionalDependencies: { optional: '^1.0.0' },
          deprecated: 'use another version',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
    });

    it('returns null for an unknown tag with no matching metadata', () => {
      const result = getRemotePackageMeta('package-a', 'unknown');

      expect(result.get()).toBeNull();
    });

    it.each([
      '../package-a',
      'https://registry.example/package-a',
      'file:package-a',
    ])('does not fetch path or URL specs: %s', (version) => {
      const result = getRemotePackageMeta('package-a', version);

      expect(result).toEqual({ cache: [], get: expect.any(Function) });
      expect(result.get()).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('supports npm aliases and uses the alias package name and range', () => {
      const result = getRemotePackageMeta('package-a', 'npm:package-b@^1.0.0');

      expect(result.get()).toEqual([
        {
          ...packageMeta,
          version: '1.2.3',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
      expect(getCacheMock).toHaveBeenCalledWith('package-b.json');
      expect(fetchMock).toHaveBeenCalledWith('package-b');
    });

    it('supports npm aliases without a package name', () => {
      const result = getRemotePackageMeta('package-a', 'npm:1.2.3');

      expect(result.get()).toEqual([
        {
          ...packageMeta,
          version: '1.2.3',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
      expect(getCacheMock).toHaveBeenCalledWith('1.2.3.json');
      expect(fetchMock).toHaveBeenCalledWith('1.2.3');
    });

    it('supports npm aliases with exact versions and tags', () => {
      npaMock.mockReturnValueOnce({
        type: 'version',
        name: 'package-b',
        fetchSpec: '1.2.3',
      });
      const exact = getRemotePackageMeta('package-a', 'npm:package-b@1.2.3');

      expect(exact.get()).toHaveLength(1);

      npaMock.mockReturnValueOnce({
        type: 'tag',
        name: 'package-b',
        fetchSpec: 'beta',
      });
      const tag = getRemotePackageMeta('package-a', 'npm:package-b@beta');

      expect(tag.get()).toHaveLength(1);
      expect(getCacheMock).toHaveBeenCalledWith('package-b.json');
    });

    it('falls back to the original name when an npm alias has no name', () => {
      npaMock.mockReturnValueOnce({
        type: 'range',
        name: undefined,
        fetchSpec: '^1.0.0',
      });

      const result = getRemotePackageMeta('package-a', 'npm:package-a');

      expect(result.get()).toHaveLength(1);
      expect(getCacheMock).toHaveBeenCalledWith('package-a.json');
    });

    it('uses all versions when an npm alias has no fetch spec', () => {
      npaMock.mockReturnValueOnce({
        type: 'tag',
        name: 'package-a',
        fetchSpec: undefined,
      });

      const result = getRemotePackageMeta('package-a', 'npm:package-a');

      expect(result.get()).toHaveLength(1);
    });

    it('returns an empty result for a malformed npm alias', () => {
      npaMock.mockImplementationOnce(() => {
        throw new Error('invalid spec');
      });

      const result = getRemotePackageMeta('package-a', 'npm:%');

      expect(result.get()).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns null when npm resolves a non-tag unsupported spec', () => {
      npaResolveMock.mockReturnValueOnce({ type: 'directory' });

      const result = getRemotePackageMeta('package-a', 'unsupported');

      expect(result.cache).toEqual([]);
      expect(result.get()).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns an empty result for unsupported package specs', () => {
      const result = getRemotePackageMeta('package-a', 'workspace:*');

      expect(result.cache).toEqual([]);
      expect(result.get()).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns matching data from an active cache without fetching', () => {
      getCacheMock.mockReturnValue(
        cache([
          { ...packageMeta, version: '1.2.3' },
          { ...packageMeta, version: '2.0.0' },
        ]),
      );

      const result = getRemotePackageMeta('package-a', '^1.0.0');

      expect(result.cache).toEqual([{ ...packageMeta, version: '1.2.3' }]);
      expect(result.get()).toEqual([{ ...packageMeta, version: '1.2.3' }]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('includes cache entries without a version in range results', () => {
      const entry = { ...packageMeta, version: undefined };
      getCacheMock.mockReturnValue(cache([entry]));

      const result = getRemotePackageMeta('package-a', '^1.0.0');

      expect(result.cache).toEqual([entry]);
      expect(result.get()).toEqual([entry]);
    });

    it('returns null for an unknown tag in an active cache', () => {
      getCacheMock.mockReturnValue(
        cache([{ ...packageMeta, version: '1.2.3' }]),
      );

      const result = getRemotePackageMeta('package-a', 'unknown');

      expect(result.cache).toEqual([]);
      expect(result.get()).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('includes versionless entries for tag queries', () => {
      const entry = { ...packageMeta, version: undefined };
      getCacheMock.mockReturnValue(cache([entry]));

      const result = getRemotePackageMeta('package-a', 'unknown');

      expect(result.cache).toEqual([entry]);
      expect(result.get()).toEqual([entry]);
    });

    it('refreshes an inactive cache and filters the refreshed data', () => {
      getCacheMock.mockReturnValue(
        cache([{ ...packageMeta, version: '1.0.0' }], false),
      );

      const result = getRemotePackageMeta('package-a', '^1.0.0');

      expect(result.cache).toEqual([{ ...packageMeta, version: '1.0.0' }]);
      expect(result.get()).toEqual([
        {
          ...packageMeta,
          version: '1.2.3',
          'dist-tags': { latest: '1.2.3', beta: '2.0.0-beta.1' },
        },
      ]);
      expect(fetchMock).toHaveBeenCalledWith('package-a');
    });

    it('returns null when refreshing an inactive cache fails', () => {
      getCacheMock.mockReturnValue(
        cache([{ ...packageMeta, version: '1.0.0' }], false),
      );
      fetchMock.mockImplementation(() => {
        throw new Error('offline');
      });

      const result = getRemotePackageMeta('package-a', '^1.0.0');

      expect(result.get()).toBeNull();
    });

    it('returns null when an inactive unknown tag has no refreshed match', () => {
      getCacheMock.mockReturnValue(
        cache([{ ...packageMeta, version: '1.0.0' }], false),
      );

      const result = getRemotePackageMeta('package-a', 'unknown');

      expect(result.get()).toBeNull();
    });

    it('does not refresh an expired cache when it proves the range is covered', () => {
      getCacheMock.mockReturnValue(
        cache(
          [
            { ...packageMeta, version: '1.0.0' },
            { ...packageMeta, version: '2.0.0' },
          ],
          false,
        ),
      );

      const result = getRemotePackageMeta('package-a', '^1.0.0');

      expect(result.get()).toEqual([{ ...packageMeta, version: '1.0.0' }]);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
