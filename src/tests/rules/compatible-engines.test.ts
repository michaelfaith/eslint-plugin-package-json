import { vi } from 'vitest';

import { rule } from '../../rules/compatible-engines.ts';
import {
  getInstalledPackageMeta,
  getRemotePackageMeta,
} from '../../utils/packageMeta/getPackageMeta.ts';
import type {
  PackageMeta,
  RemotePackageMeta,
} from '../../utils/packageMeta/PackageMeta.ts';
import { ruleTester } from './ruleTester.ts';

vi.mock('../../utils/packageMeta/getPackageMeta.ts', () => ({
  getInstalledPackageMeta: vi.fn(),
  getRemotePackageMeta: vi.fn(),
}));

const getInstalledPackageMetaMock = vi.mocked(getInstalledPackageMeta);
const getRemotePackageMetaMock = vi.mocked(getRemotePackageMeta);

const createPackageMeta = (
  engines: Record<string, string | undefined>,
): PackageMeta => ({
  engines,
  version: '1.0.0',
});

const createRemotePackageMeta = (
  engines: Record<string, string | undefined>,
): RemotePackageMeta => ({
  ...createPackageMeta(engines),
});

ruleTester.run('compatible-engines', rule, {
  invalid: [
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() => null);
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [createRemotePackageMeta({ node: '>=20' })],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "incompatible-package": "^1.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=20.0.0',
            dependencyChain: 'incompatible-package@^1.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() =>
          createPackageMeta({ node: '>=24' }),
        );
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "installed-package": "1.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=24.0.0',
            dependencyChain: 'installed-package@1.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() =>
          createPackageMeta({ node: '^22' }),
        );
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "installed-package": "1.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=22.0.0 <23.0.0-0',
            dependencyChain: 'installed-package@1.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() => null);
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [createRemotePackageMeta({ node: '>=20' })],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "cached-package": "^1.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=20.0.0',
            dependencyChain: 'cached-package@^1.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() => null);
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [],
          get: () => [createRemotePackageMeta({ node: '>=20' })],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "fetched-package": "^1.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=20.0.0',
            dependencyChain: 'fetched-package@^1.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() => null);
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [createRemotePackageMeta({ node: '>=20', npm: '>=10' })],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18", "npm": "^9" },
	"peerDependencies": { "peer-package": "^2.0.0" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=20.0.0',
            dependencyChain: 'peer-package@^2.0.0',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
        {
          data: {
            allowedModuleRange: 'npm@>=10.0.0',
            dependencyChain: 'peer-package@^2.0.0',
            myModuleRange: 'npm@^9',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockImplementation(() => null);
        getRemotePackageMetaMock.mockImplementation(() => ({
          cache: [createRemotePackageMeta({ node: '>=20' })],
          get: () => [],
        }));
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "tagged-package": "latest" }
}`,
      errors: [
        {
          data: {
            allowedModuleRange: 'node@>=20.0.0',
            dependencyChain: 'tagged-package@latest',
            myModuleRange: 'node@^18',
          },
          messageId: 'incompatibleEngines',
        },
      ],
    },
  ],
  valid: [
    '{}',
    '{ "engines": [] }',
    '{ "dependencies": { "package-a": "^1.0.0" } }',
    '{ "engines": { "node": "^24" }, "dependencies": { "invalid-package-version": 123 } }',
    '{ "engines": { "node": "^24" }, "dependencies": { 123: 123 } }',
    '{ "engines": { "node": "^24" } }',
    {
      before: () => {
        getInstalledPackageMetaMock.mockReturnValue(null);
        getRemotePackageMetaMock.mockReturnValue({
          cache: [createRemotePackageMeta({ node: '>=18' })],
          get: () => null,
        });
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "compatible-package": "^1.0.0" }
}`,
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockReturnValue(
          createPackageMeta({ node: '>=18' }),
        );
        getRemotePackageMetaMock.mockReturnValue({
          cache: [],
          get: () => null,
        });
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": { "compatible-installed-package": "^1.0.0" }
}`,
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockReturnValue(null);
        getRemotePackageMetaMock.mockReturnValue({
          cache: [],
          get: () => [createRemotePackageMeta({ node: '>=20' })],
        });
      },
      code: `{
	"engines": { "node": ">=20" },
	"dependencies": { "fetched-package": "^1.0.0" }
}`,
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockReturnValue(null);
        getRemotePackageMetaMock.mockReturnValue({
          cache: [createRemotePackageMeta({ node: '*' })],
          get: () => null,
        });
      },
      code: `{
	"engines": { "node": ">=18" },
	"dependencies": { "wildcard-package": "^1.0.0" }
}`,
    },
    {
      before: () => {
        getInstalledPackageMetaMock.mockReturnValue(null);
        getRemotePackageMetaMock.mockReturnValue({
          cache: [],
          get: () => null,
        });
      },
      code: `{
	"engines": { "node": "^18" },
	"dependencies": {
		"unsupported": "file:./unsupported",
		"missing-package": "^1.0.0"
	}
}`,
    },
  ],
});
