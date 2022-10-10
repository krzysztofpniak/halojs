import {prism} from '../prism';
import RemoteData from '../remoteData';
import {over, preview, set, view} from '../fns';
import Either from '../either';
import Arrow from '../arrow';
import Maybe from '../maybe';
import {compose, prop} from 'ramda';
import {lens} from '../lens';

const intPrism = prism(
  x => '' + x,
  x => (!isNaN(Number(x)) ? Either.Right(Number(x)) : Either.Left(x))
);

const lensX = lens(
  o => o.x,
  (o, v) => ({...o, x: v})
);

describe('prism', () => {
  it('should ', () => {
    const result = intPrism(Arrow(a => a + 1))('11');

    console.log('res', `${result}`);
  });

  it('should return Nothing for not resolvable prism', () => {
    expect(preview(intPrism, 'r55')).toEqual(Maybe.Nothing);
  });

  it('should return Just for resolvable prism', () => {
    expect(preview(intPrism, '55')).toEqual(Maybe.Just(55));
  });

  it('should over', () => {
    expect(over(intPrism, x => x + 1, 'abc')).toEqual('abc');
    expect(over(intPrism, x => x + 1, '55')).toEqual('56');
  });

  it('should compose', () => {
    expect(preview(compose(lensX, intPrism), {x: '34'})).toEqual(
      Maybe.Just(34)
    );
  });
});
