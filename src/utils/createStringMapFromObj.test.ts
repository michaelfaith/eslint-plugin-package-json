import { describe, expect, it } from 'vitest';

import { createStringMapFromObj } from './createStringMapFromObj.ts';

describe(createStringMapFromObj, () => {
  it('should create a Map from an object', () => {
    expect(
      createStringMapFromObj({
        node: '20',
        npm: '10',
      }),
    ).toEqual(
      new Map([
        ['node', '20'],
        ['npm', '10'],
      ]),
    );
  });

  it('should preserve object entry order', () => {
    expect([
      ...createStringMapFromObj({ first: '1', second: '2' }).keys(),
    ]).toEqual(['first', 'second']);
  });

  it('should convert non-nullish values to strings', () => {
    expect(
      createStringMapFromObj({
        number: 42,
        boolean: true,
        bigint: 123n,
        object: { nested: true },
        array: ['a', 'b'],
      }),
    ).toEqual(
      new Map([
        ['number', '42'],
        ['boolean', 'true'],
        ['bigint', '123'],
        ['object', '[object Object]'],
        ['array', 'a,b'],
      ]),
    );
  });

  it('should keep falsy values except null and undefined', () => {
    expect(
      createStringMapFromObj({ empty: '', zero: 0, false: false }),
    ).toEqual(
      new Map([
        ['empty', ''],
        ['zero', '0'],
        ['false', 'false'],
      ]),
    );
  });

  it('should omit null and undefined values', () => {
    expect(
      createStringMapFromObj({
        included: 'value',
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toEqual(new Map([['included', 'value']]));
  });

  it('should return an empty Map for an empty object', () => {
    expect(createStringMapFromObj({})).toEqual(new Map());
  });

  it.each([
    undefined,
    null,
    true,
    42,
    123n,
    'string',
    Symbol('symbol'),
    () => ({ value: 'value' }),
    [],
    ['value'],
  ])('should return an empty Map for %s', (input) => {
    expect(createStringMapFromObj(input)).toEqual(new Map());
  });
});
