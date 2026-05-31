import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ESLint, Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

import plugin from '../index.ts';

describe('configs', () => {
  it('recommended config works properly', async () => {
    const eslint = new ESLint({
      baseConfig: plugin.configs.recommended as Linter.Config,
      fix: true,
      overrideConfigFile: true,
    });
    const code = await readFile(
      path.resolve(import.meta.filename, '../../../package.json'),
      'utf8',
    );
    const result = await eslint.lintText(code, {
      filePath: 'package.json',
    });
    expect(
      result[0].messages.map((message) => ({
        message: message.message,
        ruleId: message.ruleId,
      })),
    ).toEqual([]);
  });

  it('recommended publishable config works properly', async () => {
    const eslint = new ESLint({
      baseConfig: plugin.configs['recommended-publishable'] as Linter.Config,
      fix: true,
      overrideConfigFile: true,
    });
    const code = await readFile(
      path.resolve(import.meta.filename, '../../../package.json'),
      'utf8',
    );
    const result = await eslint.lintText(code, {
      filePath: 'package.json',
    });
    expect(
      result[0].messages.map((message) => ({
        message: message.message,
        ruleId: message.ruleId,
      })),
    ).toEqual([]);
  });

  it('stylistic config works properly', async () => {
    const eslint = new ESLint({
      baseConfig: plugin.configs.stylistic as Linter.Config,
      fix: true,
      overrideConfigFile: true,
    });
    const code = await readFile(
      path.resolve(import.meta.filename, '../../../package.json'),
      'utf8',
    );
    const result = await eslint.lintText(code, {
      filePath: 'package.json',
    });
    expect(
      result[0].messages.map((message) => ({
        message: message.message,
        ruleId: message.ruleId,
      })),
    ).toEqual([]);
  });
});
