import {lens} from '../lens';
import {view, set, folded, over} from '../fns';
import Arrow from '../arrow';
import {compose} from 'ramda';

const lensX = lens(
  o => o.x,
  (o, v) => ({...o, x: v})
);

const Arr = {empty: () => []};

describe('lens', () => {
  it('should view with 0', () => {
    expect(lensX(Arrow(z => z + 1))({x: 3, y: 0})).toEqual({x: 4, y: 0});
  });
  it('should view with lens', () => {
    expect(view(lensX, {x: 3})).toEqual(3);
  });
  it('should set with lens 1', () => {
    expect(set(lensX, 4, {x: 3, a: 1})).toEqual({x: 4, a: 1});
  });
  it('should set with lens 2', () => {
    expect(
      over(compose(folded(Arr), lensX), a => a + '!', [
        {x: '3'},
        {x: '5'},
        {x: '4'},
      ])
    ).toEqual([{x: '3!'}, {x: '5!'}, {x: '4!'}]);
  });
  it('composes with lens', () => {
    expect(over(compose(lensX, lensX), a => a + 1, {x: {x: 4}})).toEqual({
      x: {x: 5},
    });
  });
});
