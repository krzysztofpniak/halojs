import {folded, foldMapOf} from '../fns';
import {lens} from '../lens';
import Sum from '../sum';
import Forget from '../forget';

const l1 = lens(
  o => o.x,
  (o, v) => ({...o, x: v})
);

describe('foldMapOf', () => {
  it('should 1', () => {
    expect(foldMapOf(l1, Forget(Sum, Sum), {x: 10})).toEqual(Sum(10));
  });
  it('should 2', () => {
    expect(foldMapOf(folded(Sum), Forget(Sum, Sum), [1, 2, 3])).toEqual(Sum(6));
  });
});
