import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import {
  AGENTS,
  LOCK_FILES,
  type AgentName,
  type DetectResult,
} from './constants.ts';

let packageManagerCache: DetectResult | undefined;

const userAgentRegex = /^(.+?)\/(\S+)?/;

function getPackageManagerFromUserAgent(): DetectResult | null {
  const userAgentMatch =
    process.env.npm_config_user_agent?.match(userAgentRegex);

  if (userAgentMatch) {
    const name = userAgentMatch[1] as AgentName;
    const version = userAgentMatch[2];

    if (AGENTS.includes(name)) {
      return { name, version };
    }
  }

  return null;
}

function setPackageManagerCache(result: DetectResult) {
  packageManagerCache = result;
  return packageManagerCache;
}

function* lookup(cwd: string = process.cwd()): Generator<string> {
  let directory = path.resolve(cwd);
  const { root } = path.parse(directory);

  while (directory && directory !== root) {
    yield directory;

    directory = path.dirname(directory);
  }
}

function parsePackageJson(filepath: string): DetectResult | null {
  if (!filepath || !fs.existsSync(filepath)) {
    return null;
  }

  return handlePackageManager(filepath);
}

/**
 * Detects the package manager used in the project.
 * @returns The detected package manager or `null` if not found.
 */
export function detectPackageManager(): DetectResult | null {
  if (packageManagerCache) {
    return packageManagerCache;
  }

  const cwd = process.cwd();
  const strategies = ['lockfile', 'packageManager-field', 'user-agent'];

  for (const directory of lookup(cwd)) {
    for (const strategy of strategies) {
      switch (strategy) {
        case 'lockfile': {
          // Rush monorepos wrap pnpm with `rush-pnpm`; detect them before
          // falling back to the regular lock file lookup.
          if (fs.existsSync(path.join(directory, 'rush.json'))) {
            return setPackageManagerCache({ name: 'pnpm' });
          }
          // Look up for lock files
          // eslint-disable-next-line unicorn/prefer-object-iterable-methods
          for (const lock of Object.keys(LOCK_FILES)) {
            if (fs.existsSync(path.join(directory, lock))) {
              const name = LOCK_FILES[lock];
              const result = parsePackageJson(
                path.join(directory, 'package.json'),
              );
              return setPackageManagerCache(result ?? { name });
            }
          }
          break;
        }
        case 'packageManager-field': {
          // Look up for package.json
          const result = parsePackageJson(path.join(directory, 'package.json'));
          if (result) {
            return setPackageManagerCache(result);
          }
          break;
        }
        case 'user-agent': {
          const result = getPackageManagerFromUserAgent();
          if (result) {
            return setPackageManagerCache(result);
          }
          break;
        }
      }
    }
  }

  return null;
}

interface PackageJson {
  packageManager?: string;
  devEngines?: { packageManager?: { name?: string; version?: string } };
}

function getNameAndVersion(pkg: PackageJson) {
  const normalizeVersion = (version: string | undefined) =>
    version?.match(/\d+(?:\.\d+){0,2}/)?.[0] ?? version;
  if (typeof pkg.packageManager === 'string') {
    const [name, version] = pkg.packageManager.replace(/^\^/, '').split('@', 2);
    return { name, version: normalizeVersion(version) };
  }
  if (typeof pkg.devEngines?.packageManager?.name === 'string') {
    return {
      name: pkg.devEngines.packageManager.name,
      version: normalizeVersion(pkg.devEngines.packageManager.version),
    };
  }
  return;
}

function handlePackageManager(filepath: string): DetectResult | null {
  // read `packageManager` field in package.json using an optional custom parser
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const pkg = JSON.parse(content) as PackageJson;

    const nameAndVer = getNameAndVersion(pkg);
    if (nameAndVer) {
      const name = nameAndVer.name as AgentName;
      const version = nameAndVer.version;
      return { name, version };
    }
  } catch {
    /* empty */
  }
  return null;
}
