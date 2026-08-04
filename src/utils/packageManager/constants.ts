export type AgentName =
  'npm' | 'yarn' | 'pnpm' | 'bun' | 'deno' | 'nub' | 'aube';

export interface DetectResult {
  /**
   * Agent name without the specifier.
   *
   * Can be `npm`, `yarn`, `pnpm`, `bun`, `deno`, `nub`, or `aube`.
   */
  name: AgentName;

  /**
   * Specific version of the agent, read from `packageManager` field in package.json.
   */
  version?: string;
}

export const AGENTS: AgentName[] = [
  'npm',
  'yarn',
  'pnpm',
  'bun',
  'deno',
  'nub',
  'aube',
];

// the order here matters, more specific one comes first
export const LOCK_FILES: Record<string, AgentName> = {
  'aube-lock.yaml': 'aube',
  'aube-workspace.yaml': 'aube',
  'bun.lock': 'bun',
  'bun.lockb': 'bun',
  'deno.lock': 'deno',
  'nub.lock': 'nub',
  'pnpm-lock.yaml': 'pnpm',
  'pnpm-workspace.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
};
