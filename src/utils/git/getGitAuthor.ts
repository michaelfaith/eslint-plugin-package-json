import { execFileSync } from 'node:child_process';

interface Author {
  email?: string;
  name: string;
}

let cachedAuthor: Author | null | undefined;

export const getGitAuthor = (): Author | undefined => {
  if (cachedAuthor === null) {
    return undefined;
  } else if (cachedAuthor !== undefined) {
    return cachedAuthor;
  }

  try {
    const name = execFileSync('git', ['config', '--get', 'user.name'], {
      encoding: 'utf8',
    }).trim();

    const email = execFileSync('git', ['config', '--get', 'user.email'], {
      encoding: 'utf8',
    }).trim();

    cachedAuthor = {
      name,
      ...(email && { email }),
    };
  } catch {
    cachedAuthor = null;
    return undefined;
  }

  return cachedAuthor;
};
