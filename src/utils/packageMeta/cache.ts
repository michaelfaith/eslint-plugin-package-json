import fs from 'node:fs';
import path from 'node:path';

import { findUpSync } from 'find-up-simple';

import type { RemotePackageMeta } from './PackageMeta.ts';

const maxCacheLength = 1000 * 60 * 60; // 1h
const nodeModulesRoot =
  findUpSync('node_modules', { type: 'directory' }) ??
  path.resolve(import.meta.dirname, '../..');
const cacheRoot = path.resolve(
  nodeModulesRoot,
  './.cache/eslint-plugin-package-json/meta',
);

export interface CacheContent {
  expiration: number;
  data: RemotePackageMeta[];
  timestamp: number;
}

export interface CachePayload {
  content: CacheContent;
  isActive: boolean;
}

export const getCache = (cacheFileName: string): CachePayload | null => {
  const cacheFilePath = path.join(cacheRoot, cacheFileName);

  if (!fs.existsSync(cacheFilePath)) {
    return null;
  }

  const cache = JSON.parse(
    fs.readFileSync(cacheFilePath, 'utf8'),
  ) as CacheContent | null;

  if (!cache?.data) {
    return null;
  }

  const isActive = Boolean(
    cache.expiration >= Date.now() ||
    cache.timestamp + maxCacheLength >= Date.now() ||
    (cache.data.length === 1 && cache.data[0].deprecated),
  );

  return {
    content: cache,
    isActive,
  };
};

export const writeCache = (
  cacheFileName: string,
  data: RemotePackageMeta[],
): void => {
  fs.mkdirSync(cacheRoot, { recursive: true });
  const cacheFilePath = path.join(cacheRoot, cacheFileName);

  const timestamp = Date.now();
  // Using random to stagger cache expiry
  const expiration = timestamp + Math.floor(Math.random() * 1000 * 60 /* 1m */);
  const content: CacheContent = {
    data,
    expiration,
    timestamp,
  };

  fs.writeFileSync(cacheFilePath, JSON.stringify(content));
};
