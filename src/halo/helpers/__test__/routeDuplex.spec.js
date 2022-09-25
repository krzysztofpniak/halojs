import Either from '../either';
import {
  parse,
  print,
  path,
  segment,
  root,
  product,
  Product,
  sum,
  noArgs,
  optional,
  RouteDuplex,
} from '../routeDuplex/routeduplex';
import daggy from 'daggy';
import Maybe from '../maybe';

describe('routeDuplex', () => {
  describe('root', () => {
    const p = root(segment);
    const p2 = root(noArgs);
    it('should parse root', () => {
      expect(parse(p, '/a')).toEqual(Either.Right('a'));
    });
    it('should print root', () => {
      expect(print(p, 'a')).toEqual('/a');
      expect(print(p2, 'a')).toEqual('/');
    });
  });
  describe('path', () => {
    const p = path('/api/v1', segment);
    it('should parse path', () => {
      expect(parse(p, '/api/v1/a')).toEqual(Either.Right('a'));
    });
    it('should print path', () => {
      expect(print(p, 'a')).toEqual('/api/v1/a');
    });
  });
  describe('optional', () => {
    const p = optional(segment);
    it('should parse optional', () => {
      expect(parse(p, 'a')).toEqual(Either.Right(Maybe.Just('a')));
      expect(parse(p, '')).toEqual(Either.Right(Maybe.Nothing));
    });
    it('should print optional', () => {
      expect(print(p, Maybe.Just('a'))).toEqual('a');
      expect(print(p, Maybe.Nothing)).toEqual('');
    });
  });
  describe('param', () => {
    const p = RouteDuplex.param('a');
    it('should parse param', () => {
      expect(parse(p, '?a=1%20%2B%202')).toEqual(Either.Right('1 + 2'));
    });
    it('should print param', () => {
      expect(print(p, '1 + 2')).toEqual('?a=1%20%2B%202');
    });
  });
  describe('product', () => {
    const p = product(path('user', segment), path('post', segment));
    const p2 = product(
      path('user', segment),
      product(path('post', segment), path('comments', segment))
    );
    it('should parse product', () => {
      expect(parse(p, 'user/john/post/12')).toEqual(
        Either.Right(Product('john', '12'))
      );
    });
    it('should parse product2', () => {
      expect(parse(p2, 'user/john/post/12/comments/3')).toEqual(
        Either.Right(Product('john', Product('12', '3')))
      );
    });
    it('should print product', () => {
      expect(print(p, Product('john', '12'))).toEqual('user/john/post/12');
    });
  });
  describe('sum', () => {
    const S = daggy.taggedSum('S', {A: [], B: ['x'], C: ['y', 'z']});

    const p = sum(S)({
      A: noArgs,
      B: path('b', segment),
      C: product(path('c', segment), segment),
    });

    it('should parse sum', () => {
      expect(parse(p, '')).toEqual(Either.Right(S.A));
      expect(parse(p, 'b/john')).toEqual(Either.Right(S.B('john')));
      expect(parse(p, 'c/john/paul')).toEqual(
        Either.Right(S.C('john', 'paul'))
      );
    });

    it('should print sum', () => {
      expect(print(p, S.A)).toEqual('');
      expect(print(p, S.B('john'))).toEqual('b/john');
      expect(print(p, S.C('john', 'paul'))).toEqual('c/john/paul');
    });
  });
  describe('record', () => {
    const p = RouteDuplex.record
      .pipe(RouteDuplex.prop('year')(segment))
      .pipe(RouteDuplex.prop('month')(segment));
    it('should parse param', () => {
      expect(parse(p, '2022/02')).toEqual(
        Either.Right({month: '02', year: '2022'})
      );
    });
    it('should print param', () => {
      expect(print(p, {month: '02', year: '2022'})).toEqual('2022/02');
    });
  });

  describe('record2', () => {
    const p = path(
      'feed',
      RouteDuplex.record.pipe(
        RouteDuplex.prop('search')(optional(RouteDuplex.param('search')))
      )
    );
    it('should parse param', () => {
      expect(parse(p, 'feed?search=test')).toEqual(
        Either.Right({search: Maybe.Just('test')})
      );
      expect(parse(p, 'feed')).toEqual(Either.Right({search: Maybe.Nothing}));
    });
    it('should print param', () => {
      expect(print(p, {search: Maybe.Just('test')})).toEqual(
        'feed?search=test'
      );
    });
  });

  describe('params', () => {
    const p = RouteDuplex.params({
      search: optional,
    });
    it('should parse params', () => {
      expect(parse(p, 'feed?search=test')).toEqual(
        Either.Right({search: Maybe.Just('test')})
      );
      expect(parse(p, 'feed')).toEqual(Either.Right({search: Maybe.Nothing}));
    });
    it('should print params', () => {
      expect(print(p, {search: Maybe.Just('test')})).toEqual('?search=test');
    });
  });
});
