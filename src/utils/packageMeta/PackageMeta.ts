export interface PackageMeta {
  engines?: Record<string, string | undefined> | undefined;
  dependencies?: Record<string, string | undefined> | undefined;
  peerDependencies?: Record<string, string | undefined> | undefined;
  optionalDependencies?: Record<string, string | undefined> | undefined;
  version?: string | undefined;
  _origin?: string;
}

export type RemotePackageMeta = PackageMeta & {
  deprecated?: string | undefined;
  'dist-tags'?: Record<string, string | undefined> | undefined;
};

export const isPackageMeta = (
  possiblePackageMeta: unknown,
): possiblePackageMeta is PackageMeta =>
  typeof possiblePackageMeta === 'object' &&
  !!possiblePackageMeta &&
  !Array.isArray(possiblePackageMeta);
