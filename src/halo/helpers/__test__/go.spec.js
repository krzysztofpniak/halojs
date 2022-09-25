import go from '../go';
import Maybe from '../maybe';

describe('go', () => {
  it('should work with maybe', () => {
    expect(
      go(function* () {
        return Maybe.Just(12);
      })
    ).toEqual(Maybe.Just(12));

    expect(
      go(function* () {
        const a = yield Maybe.Just(2);
        const b = yield Maybe.Just(3);
        return Maybe.Just(a * b);
      })
    ).toEqual(Maybe.Just(6));
  });
});
