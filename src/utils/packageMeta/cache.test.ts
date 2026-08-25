import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCache, writeCache } from './cache.ts';
import type { RemotePackageMeta } from './PackageMeta.ts';

const { existsSyncMock, readFileSyncMock, mkdirSyncMock, writeFileSyncMock } =
  vi.hoisted(() => ({
    existsSyncMock: vi.fn(),
    readFileSyncMock: vi.fn(),
    mkdirSyncMock: vi.fn(),
    writeFileSyncMock: vi.fn(),
  }));

vi.mock('node:fs', () => ({
  default: {
    existsSync: existsSyncMock,
    readFileSync: readFileSyncMock,
    mkdirSync: mkdirSyncMock,
    writeFileSync: writeFileSyncMock,
  },
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
  mkdirSync: mkdirSyncMock,
  writeFileSync: writeFileSyncMock,
}));

vi.mock('find-up-simple', () => ({
  findUpSync: vi.fn().mockReturnValue('/repo/root/node_modules'),
}));

const cacheFileName = 'package-a.json';
const cacheRoot = path.resolve(
  '/repo/root/node_modules',
  './.cache/eslint-plugin-package-json/meta',
);
const cacheFilePath = path.join(cacheRoot, cacheFileName);
const now = new Date('2026-08-23T12:00:00.000Z').getTime();
const packageMeta: RemotePackageMeta = {
  deprecated: undefined,
  'dist-tags': { latest: '1.0.0' },
  version: '1.0.0',
  engines: undefined,
  dependencies: undefined,
  peerDependencies: undefined,
  optionalDependencies: undefined,
};
const activeCacheCases: [
  string,
  { expiration?: number; timestamp?: number; data?: RemotePackageMeta[] },
][] = [
  ['the expiration is in the future', { expiration: now + 1 }],
  ['the timestamp is less than one hour old', { timestamp: now - 1 }],
  [
    'the only package is deprecated',
    {
      timestamp: now - 60 * 60 * 1000,
      data: [{ ...packageMeta, deprecated: 'obsolete' }],
    },
  ],
];

describe('cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    existsSyncMock.mockReturnValue(false);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe(getCache, () => {
    it('returns null when the cache file does not exist', () => {
      expect(getCache(cacheFileName)).toBeNull();
      expect(existsSyncMock).toHaveBeenCalledWith(cacheFilePath);
      expect(readFileSyncMock).not.toHaveBeenCalled();
    });

    it('returns null when the cache has no data', () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify({ expiration: now }));

      expect(getCache(cacheFileName)).toBeNull();
      expect(readFileSyncMock).toHaveBeenCalledWith(cacheFilePath, 'utf8');
    });

    it.each(activeCacheCases)(
      'returns an active cache when %s',
      (_reason, activeFields) => {
        existsSyncMock.mockReturnValue(true);
        const content = {
          data: activeFields.data ?? [packageMeta],
          expiration: activeFields.expiration ?? now - 1,
          timestamp: activeFields.timestamp ?? now - 60 * 60 * 1000 - 1,
        };
        readFileSyncMock.mockReturnValue(JSON.stringify(content));

        expect(getCache(cacheFileName)).toEqual({ content, isActive: true });
      },
    );

    it('returns an inactive cache when it is expired and not deprecated', () => {
      existsSyncMock.mockReturnValue(true);
      const content = {
        data: [packageMeta],
        expiration: now - 1,
        timestamp: now - 60 * 60 * 1000 - 1,
      };
      readFileSyncMock.mockReturnValue(JSON.stringify(content));

      expect(getCache(cacheFileName)).toEqual({ content, isActive: false });
    });
  });

  describe(writeCache, () => {
    it('creates the cache directory and writes timestamped content', () => {
      writeCache(cacheFileName, [packageMeta]);

      expect(mkdirSyncMock).toHaveBeenCalledWith(cacheRoot, {
        recursive: true,
      });
      expect(writeFileSyncMock).toHaveBeenCalledWith(
        cacheFilePath,
        JSON.stringify({
          data: [packageMeta],
          expiration: now + 30_000,
          timestamp: now,
        }),
      );
    });
  });
});
