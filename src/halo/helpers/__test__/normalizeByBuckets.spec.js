import {
  sortBy,
  pipe,
  prop,
  map,
  evolve,
  sum,
  nth,
  length,
  adjust,
  groupBy,
  converge,
  repeat,
  toPairs,
  chain,
} from 'ramda';
import moment from 'moment';

const normalizeByBuckets = step => data =>
  pipe(
    //sortBy(nth(0)),
    map(adjust(0, x => moment(x).startOf(step).valueOf())),
    groupBy(nth(0)),
    map(pipe(map(nth(1)), converge(repeat, [sum, length]))),
    toPairs,
    chain(([k, v]) => map(x => [new Date(+k), x], v))
  )(data);

const data = [
  [new Date(2022, 2, 15), 40],
  [new Date(2022, 1, 6), 20],
  [new Date(2022, 10, 5), 11],
];

describe('normalizeByBuckets', () => {
  it('should work with Y', () => {
    expect(normalizeByBuckets('Y')(data)).toEqual([
      [new Date(2022, 0, 1), 71],
      [new Date(2022, 0, 1), 71],
      [new Date(2022, 0, 1), 71],
    ]);
  });

  it('should work with Q', () => {
    expect(normalizeByBuckets('Q')(data)).toEqual([
      [new Date(2022, 0, 1), 60],
      [new Date(2022, 0, 1), 60],
      [new Date(2022, 3, 1), 0],
      [new Date(2022, 6, 1), 0],
      [new Date(2022, 9, 1), 11],
    ]);
  });
});
