import { beforeEach, describe, expect, it, vi } from 'vitest';

const execFileSync = vi.fn();

vi.mock('node:child_process', () => ({
  execFileSync,
}));

const importGetGitAuthor = async () => await import('./getGitAuthor.ts');

describe('getGitAuthor', () => {
  beforeEach(() => {
    vi.resetModules();
    execFileSync.mockReset();
  });

  it('should return author name and email from git config output', async () => {
    execFileSync
      .mockReturnValueOnce(' Jane Doe \n')
      .mockReturnValueOnce(' jane@example.com \n');

    const { getGitAuthor } = await importGetGitAuthor();

    expect(getGitAuthor()).toEqual({
      email: 'jane@example.com',
      name: 'Jane Doe',
    });
    expect(execFileSync).toHaveBeenCalledTimes(2);
    expect(execFileSync).toHaveBeenNthCalledWith(
      1,
      'git',
      ['config', '--get', 'user.name'],
      { encoding: 'utf8' },
    );
    expect(execFileSync).toHaveBeenNthCalledWith(
      2,
      'git',
      ['config', '--get', 'user.email'],
      { encoding: 'utf8' },
    );
  });

  it('should cache the resolved author and does not call git again on subsequent calls', async () => {
    execFileSync
      .mockReturnValueOnce(' Jane Doe \n')
      .mockReturnValueOnce(' jane@example.com \n');

    const { getGitAuthor } = await importGetGitAuthor();

    expect(getGitAuthor()).toEqual({
      email: 'jane@example.com',
      name: 'Jane Doe',
    });
    expect(getGitAuthor()).toEqual({
      email: 'jane@example.com',
      name: 'Jane Doe',
    });
    expect(execFileSync).toHaveBeenCalledTimes(2);
  });

  it('should return undefined when git config commands fail', async () => {
    execFileSync.mockImplementation(() => {
      throw new Error('git config failed');
    });

    const { getGitAuthor } = await importGetGitAuthor();

    expect(getGitAuthor()).toBeUndefined();
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });

  it('should no longer try to call git if git config fails and returns undefined on subsequent calls', async () => {
    execFileSync.mockImplementation(() => {
      throw new Error('git config failed');
    });

    const { getGitAuthor } = await importGetGitAuthor();

    expect(getGitAuthor()).toBeUndefined();
    expect(getGitAuthor()).toBeUndefined();
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });
});
