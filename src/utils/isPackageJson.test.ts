import { describe, expect, test } from 'vitest';

import { isPackageJson } from './isPackageJson.ts';

describe('isPackageJson', () => {
  test.each([
    ['', false],
    ['-', false],
    ['other', false],
    ['package.js', false],
    ['package.jsx', false],
    ['-package.json', false],
    ['prefix-package.json', false],
    ['package.json.json', false],
    ['package.nls.json', false],
    ['package.nls.zh-cn.json', false],
    ['package.package.json', false],
    ['package.json.package.json', false],
    ['package.json-package.json', false],
    ['package.json', true],
    ['/package.json', true],
    ['\\package.json', true],
    ['prefix/package.json', true],
    ['prefix\\package.json', true],
    ['mixed\\prefix/package.json', true],
    ['mixed/prefix\\package.json', true],
  ])(`%s`, (input, expected) => {
    expect(isPackageJson(input)).toBe(expected);
  });
});
