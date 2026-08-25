import {
  inc,
  intersects,
  Range,
  subset,
  type Comparator,
  type SemVer,
} from 'semver';

import { getSemverRange } from './getSemverRange.ts';

/**
 * Merge multiple semver ranges into a single {@link Range}.
 */
export const mergeSemverRanges = (...ranges: Range[]): Range | null => {
  const map = new Map<
    string,
    { range: Range; comparators: readonly Comparator[] }
  >();
  for (const range of ranges) {
    for (const comparators of range.set) {
      const normalized = normalizeComparators(comparators);
      if (map.has(normalized)) {
        continue;
      }
      const normalizedVer = getSemverRange(normalized);
      if (!normalizedVer) {
        continue;
      }
      let consume = false;
      let target = { range: normalizedVer, comparators };
      for (const [k, data] of map) {
        if (subset(target.range, data.range)) {
          consume = true;
          break;
        }
        if (subset(data.range, target.range)) {
          map.delete(k);
        }
        if (intersects(target.range, data.range)) {
          const newComparators = joinComparators(comparators, data.comparators);
          if (newComparators) {
            target = {
              range: new Range(normalizeComparators(newComparators)),
              comparators: newComparators,
            };
            map.delete(k);
          }
        }
      }
      if (consume) {
        continue;
      }
      map.set(target.range.raw, target);
    }
  }
  const mergedRanges = [...map]
    .sort(([, a], [, b]) => {
      const aVer = getMinVer(a.comparators);
      const bVer = getMinVer(b.comparators);

      return aVer.compare(bVer);
    })
    .map(([v]) => v);
  return getSemverRange(mergedRanges.join('||'));

  /** Get min version. */
  function getMinVer(comparators: readonly Comparator[]) {
    let min: SemVer | null = null;
    for (const comp of comparators) {
      if (!min || comp.semver.compare(min) < 0) {
        min = comp.semver;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return min!;
  }
};

const normalizeComparators = (comparators: readonly Comparator[]): string => {
  const rangeComparator = toRangeComparator(comparators);
  if (
    rangeComparator?.min &&
    rangeComparator.max &&
    rangeComparator.min.operator === '>=' &&
    rangeComparator.max.operator === '<'
  ) {
    if (
      rangeComparator.min.semver.major !== 0 &&
      inc(rangeComparator.min.semver.version, 'premajor') ===
        rangeComparator.max.semver.version
    ) {
      return `^${rangeComparator.min.semver.version}`;
    }
    if (
      inc(rangeComparator.min.semver.version, 'preminor') ===
      rangeComparator.max.semver.version
    ) {
      return `~${rangeComparator.min.semver.version}`;
    }
  }
  return comparators.map(normalizeComparator).join(' ');
};

const normalizeComparator = (comparator: Comparator): string => {
  if (comparator.operator === '') {
    return comparator.value || '*';
  }
  return comparator.value;
};

const joinComparators = (
  a: readonly Comparator[],
  b: readonly Comparator[],
): readonly Comparator[] | null => {
  const aRangeComparator = toRangeComparator(a);
  const bRangeComparator = toRangeComparator(b);
  if (aRangeComparator && bRangeComparator) {
    const comparators: Comparator[] = [];
    if (aRangeComparator.min && bRangeComparator.min) {
      comparators.push(
        aRangeComparator.min.semver.compare(bRangeComparator.min.semver) <= 0
          ? aRangeComparator.min
          : bRangeComparator.min,
      );
    }
    if (aRangeComparator.max && bRangeComparator.max) {
      comparators.push(
        aRangeComparator.max.semver.compare(bRangeComparator.max.semver) >= 0
          ? aRangeComparator.max
          : bRangeComparator.max,
      );
    }
    if (comparators.length === 0) {
      return new Range('*').set[0];
    }
    return comparators;
  }

  return null;
};

type RangeComparator =
  | { min: Comparator; max: Comparator }
  | { min: null; max: Comparator }
  | { min: Comparator; max: null };

/** Convert to RangeComparator. */
const toRangeComparator = (
  comparators: readonly Comparator[],
): RangeComparator | null => {
  if (comparators.length === 2) {
    if (comparators[0].operator === '>' || comparators[0].operator === '>=') {
      if (comparators[1].operator === '<' || comparators[1].operator === '<=') {
        return {
          min: comparators[0],
          max: comparators[1],
        };
      }
    } else if (
      (comparators[0].operator === '<' || comparators[0].operator === '<=') &&
      (comparators[1].operator === '>' || comparators[1].operator === '>=')
    ) {
      return {
        min: comparators[1],
        max: comparators[0],
      };
    }
  }
  if (comparators.length === 1) {
    if (comparators[0].operator === '>' || comparators[0].operator === '>=') {
      return {
        min: comparators[0],
        max: null,
      };
    } else if (
      comparators[0].operator === '<' ||
      comparators[0].operator === '<='
    ) {
      return {
        min: null,
        max: comparators[0],
      };
    }
  }
  return null;
};
