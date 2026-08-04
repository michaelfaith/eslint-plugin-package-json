import path from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const existsSyncMock = vi.fn();
const readFileSyncMock = vi.fn();
const cwdMock = vi.fn();
const env: Record<string, string | undefined> = {};

vi.mock('node:fs', () => ({
  default: {
    existsSync: existsSyncMock,
    readFileSync: readFileSyncMock,
  },
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
}));

const processMock = {
  cwd: cwdMock,
  env,
};

vi.mock('node:process', () => ({
  default: processMock,
  ...processMock,
}));

const importDetectPackageManager = async () =>
  await import('./detectPackageManager.ts');

describe('detectPackageManager', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    cwdMock.mockReset();
    existsSyncMock.mockReset();
    readFileSyncMock.mockReset();
    for (const key of Object.keys(env)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete env[key];
    }
    env.npm_config_user_agent = undefined;
    existsSyncMock.mockReturnValue(false);
    readFileSyncMock.mockImplementation(() => {
      throw new Error('Unexpected read');
    });
  });

  it('detects a package manager from a lockfile in the current directory', async () => {
    const cwd = path.resolve('/workspace/project');
    const lockfilePath = path.join(cwd, 'pnpm-lock.yaml');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === lockfilePath,
    );

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm' });
  });

  it('prefers rush.json detection over regular lockfile detection', async () => {
    const cwd = path.resolve('/workspace/project');
    const rushPath = path.join(cwd, 'rush.json');
    const lockfilePath = path.join(cwd, 'pnpm-lock.yaml');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === rushPath || filepath === lockfilePath,
    );

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm' });
  });

  it('detects packageManager field values from package.json', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({ packageManager: 'pnpm@9.1.0' });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm', version: '9.1.0' });
  });

  it('detects devEngines.packageManager values when packageManager is absent', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({
          devEngines: {
            packageManager: {
              name: 'bun',
              version: '1.2.3',
            },
          },
        });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'bun', version: '1.2.3' });
  });

  it('detects packageManager field values from package.json with sha hash version', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({
          packageManager:
            'pnpm@11.1.0+sha512.5383cc12567a95f1d668fbe762dfe0075c595b4bfff433be478dbbe24e05251a8e8c3eb992a986667c1d53b6c3a9c85b8398c35a960587fbd9fa3a0915406728',
        });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm', version: '11.1.0' });
  });

  it('detects packageManager field values from package.json with bad version', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({
          packageManager: 'pnpm@sha',
        });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm', version: 'sha' });
  });

  it('looks upward for package.json values in parent directories', async () => {
    const cwd = path.resolve('/workspace/project/packages/app');
    const currentPackageJsonPath = path.join(cwd, 'package.json');
    const parentPackageJsonPath = path.join(
      path.dirname(cwd),
      '..',
      'package.json',
    );
    const resolvedParentPackageJsonPath = path.resolve(parentPackageJsonPath);

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) =>
        filepath === currentPackageJsonPath ||
        filepath === resolvedParentPackageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === resolvedParentPackageJsonPath) {
        return JSON.stringify({ packageManager: 'yarn@4.5.0' });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'yarn', version: '4.5.0' });
  });

  it('uses npm_config_user_agent when no file-based detection matches', async () => {
    const cwd = path.resolve('/workspace/project');

    cwdMock.mockReturnValue(cwd);
    env.npm_config_user_agent = 'pnpm/9.1.0';

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toEqual({ name: 'pnpm', version: '9.1.0' });
  });

  it('ignores unsupported user agents and returns null', async () => {
    const cwd = path.resolve('/workspace/project');

    cwdMock.mockReturnValue(cwd);
    env.npm_config_user_agent = 'unknown/1.0.0';

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toBeNull();
  });

  it('returns null when package.json exists but does not include packageManager field', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({ name: 'my-package' });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toBeNull();
  });

  it('returns null when package.json exists but cannot be parsed', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        throw new Error('Invalid JSON');
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    expect(detectPackageManager()).toBeNull();
  });

  it('caches the detected package manager after the first lookup', async () => {
    const cwd = path.resolve('/workspace/project');
    const packageJsonPath = path.join(cwd, 'package.json');

    cwdMock.mockReturnValue(cwd);
    existsSyncMock.mockImplementation(
      (filepath: string) => filepath === packageJsonPath,
    );
    readFileSyncMock.mockImplementation((filepath: string) => {
      if (filepath === packageJsonPath) {
        return JSON.stringify({ packageManager: 'npm@10.2.0' });
      }

      throw new Error(`Unexpected file: ${filepath}`);
    });

    const { detectPackageManager } = await importDetectPackageManager();

    const firstResult = detectPackageManager();
    const secondResult = detectPackageManager();

    expect(firstResult).toEqual({ name: 'npm', version: '10.2.0' });
    expect(secondResult).toEqual(firstResult);
    expect(readFileSyncMock).toHaveBeenCalledTimes(1);
  });
});
