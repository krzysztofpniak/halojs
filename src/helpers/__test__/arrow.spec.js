import Arrow from '../arrow';
import Either from '../either';
import Pair from '../pair';

describe('Arrow', () => {
  it('should implement rmap', () => {
    expect(
      Arrow(a => a + 1)
        .rmap(a => ({a}))
        .runWith(1)
    ).toEqual({a: 2});
  });

  it('should implement right', () => {
    expect(
      Arrow(a => a + 1)
        .right()
        .runWith(Either.Left(1))
    ).toEqual(Either.Left(1));

    expect(
      Arrow(a => a + 1)
        .right()
        .runWith(Either.Right(1))
    ).toEqual(Either.Right(2));
  });

  it('should implement first', () => {
    expect(
      Arrow(a => a + 1)
        .first()
        .runWith(Pair(0, 1))
    ).toEqual(Pair(1, 1));
  });

  it('should implement second', () => {
    expect(
      Arrow(a => a + 1)
        .second()
        .runWith(Pair(0, 1))
    ).toEqual(Pair(0, 2));
  });
});
