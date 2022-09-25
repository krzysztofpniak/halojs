import daggy from 'daggy';
import Maybe from '../maybe';
import Pair from '../pair';
import {
  always,
  apply,
  assoc,
  equals,
  evolve,
  identity,
  map,
  reduce,
  reverse,
  tail,
  toPairs,
  unfold,
} from 'ramda';
import {find, head, uncons, unit} from '../fns';
import Either from '../either';
import Id from '../id';
import RoutePrinter from './routePrinter';

const RouteError = daggy.taggedSum('RouteError', {
  Expected: ['a', 'b'],
  ExpectedEndOfPath: ['a'],
  MissingParam: ['a'],
  EndOfPath: [],
});

const RouteResult = daggy.taggedSum('RouteResult', {
  Fail: ['routeError'],
  Success: ['routeState', 'a'],
});

RouteResult.prototype.map = function (fn) {
  return this.cata({
    Fail: () => this,
    Success: (state, a) => RouteResult.Success(state, fn(a)),
  });
};

const RouteParser = daggy.taggedSum('RouteParser', {
  Alt: ['a'],
  Chomp: ['c'],
  Prefix: ['a', 'b'],
});

RouteParser.of = v => RouteParser.Chomp(state => RouteResult.Success(state, v));

RouteParser.prototype.map = function (fn) {
  return this.cata({
    Alt: ps => RouteParser.Alt(ps.map(p => p.map(fn))),
    Chomp: g => RouteParser.Chomp(state => g(state).map(fn)),
    Prefix: (str, parser) => RouteParser.Prefix(str, parser.map(fn)),
  });
};

RouteParser.prototype.ap = function (x) {
  return RouteParser.Chomp(state =>
    runRouteParser(state, this).cata({
      Fail: e => RouteResult.Fail(e),
      Success: (state2, f) => runRouteParser(state2, x).map(f),
    })
  );
};

const RouteDuplex = daggy.tagged('RouteDuplex', ['enc', 'dec']);

RouteDuplex.prototype.pipe = function (fn) {
  return fn(this);
};

RouteDuplex.record = RouteDuplex(a => RoutePrinter.empty, RouteParser.of({}));

RouteDuplex.prop = key => p1 => p2 =>
  RouteDuplex(
    a => p2.enc(a).append(p1.enc(a[key])),
    p2.dec.map(o => v => assoc(key, v, o)).ap(p1.dec)
  );

const Product = daggy.tagged('Product', ['a', 'b']);

const NoArguments = daggy.tagged('NoArguments', []);

const indexOf = (p, str) => {
  const idx = str.indexOf(p);
  return idx >= 0 ? Maybe.Just(idx) : Maybe.Nothing;
};

const take = (idx, str) => str.substr(0, idx);

const drop = (idx, str) => str.substr(idx);

const splitAt = (p, str) =>
  indexOf(p, str).cata({
    Just: idx => Pair(take(idx, str), drop(idx + p.length, str)),
    Nothing: () => Pair(str, ''),
  });

const splitNonEmpty = (p, str) => (str === '' ? [] : str.split(p));

const splitSegments = path => {
  const segments = splitNonEmpty('/', path);
  return equals(segments, ['', '']) ? [''] : segments.map(decodeURIComponent);
};

const splitParams = str => splitNonEmpty('&', str).map(splitKeyValue);

const splitKeyValue = str =>
  splitAt('=', str).bimap(decodeURIComponent, decodeURIComponent);

const splitPath = str => splitAt('?', str).bimap(splitSegments, splitParams);

const toRouteState = pair => ({
  segments: pair.fst.fst,
  params: pair.fst.snd,
  hash: pair.snd,
});

const parsePath = s => splitAt('#', s).lmap(splitPath).pipe(toRouteState);

const chompPrefix = (pre, state) =>
  head(state.segments).cata({
    Just: pre2 =>
      pre2 === pre
        ? RouteResult.Success(
            evolve({segments: ([h, ...tail]) => tail})(state),
            'unit'
          )
        : RouteResult.Fail(RouteError.Expected(pre, pre2)),
    Nothing: () => '',
  });

const goAlt = state => (prev, current) =>
  RouteResult.Fail.is(prev) ? runRouteParser(state, current) : prev;

const runRouteParser = (state, p) =>
  p.cata({
    Alt: xs => reduce(goAlt(state), RouteResult.Fail(RouteError.EndOfPath), xs),
    Chomp: f => f(state),
    Prefix: (pre, p2) =>
      chompPrefix(pre, state).cata({
        Fail: x => RouteResult.Fail(x),
        Success: state2 => runRouteParser(state2, p2),
      }),
  });

const Parser = {
  take: RouteParser.Chomp(state =>
    uncons(state.segments).cata({
      Just: ({head, tail}) =>
        RouteResult.Success({...state, segments: tail}, head),
      Nothing: () => RouteResult.Fail(RouteError.EndOfPath),
    })
  ),
  prefix: (str, p) => RouteParser.Prefix(str, p),
  run: (p, str) =>
    runRouteParser(parsePath(str), p).cata({
      Fail: err => Either.Left(err),
      Success: (_, res) => Either.Right(res),
    }),
  as: (print, decode, p) =>
    RouteParser.Chomp(state =>
      runRouteParser(state, p).cata({
        Fail: err => RouteResult.Fail(err),
        Success: (state2, a) =>
          decode(a).cata({
            Left: err => RouteResult.Fail(RouteError.Expected(err, print(a))),
            Right: b => RouteResult.Success(state2, b),
          }),
      })
    ),
  param: key =>
    RouteParser.Chomp(state =>
      find(({fst, snd}) => fst === key)(state.params)
        .map(x => x.snd)
        .cata({
          Just: a => RouteResult.Success(state, a),
          Nothing: () => RouteResult.Fail(RouteError.MissingParam(key)),
        })
    ),
  optional: p =>
    RouteParser.Chomp(state =>
      runRouteParser(state, p).cata({
        Fail: () => RouteResult.Success(state, Maybe.Nothing),
        Success: (state2, a) => RouteResult.Success(state2, Maybe.Just(a)),
      })
    ),
  end: RouteParser.Chomp(state =>
    state.segments.length === 0
      ? RouteResult.Success(state, {})
      : RouteResult.Fail(RouteError.EndOfPath)
  ),
};

RouteDuplex.param = p => RouteDuplex(RoutePrinter.param(p), Parser.param(p));

RouteDuplex.params = def =>
  Id(def)
    .map(toPairs)
    .map(xs =>
      reduce(
        (p, [key, value]) =>
          RouteDuplex.prop(key)(value(RouteDuplex.param(key)))(p),
        RouteDuplex.record,
        xs
      )
    )
    .extract();

// applyFirst :: forall a b f. Apply f => f a -> f b -> f a
// applyFirst a b = const <$> a <*> b

RouteDuplex.end = p => RouteDuplex(p.enc, p.dec.map(always).ap(Parser.end));

const argsToArray = a =>
  unfold(
    n =>
      Product.is(n)
        ? [n.a, n.b]
        : !NoArguments.is(n)
        ? [n, NoArguments()]
        : false,
    a
  );

const arrayToArgs = a =>
  a.length === 0
    ? NoArguments()
    : a.length === 1
    ? a[0]
    : Product(a[0], arrayToArgs(tail(a)));

const sum = typeRep => rows =>
  RouteDuplex(
    a => rows[a['@@tag']].enc(arrayToArgs(a['@@values'])),
    RouteParser.Alt(
      map(
        ([key, routeDuplex]) =>
          Parser.as(
            identity,
            a => {
              const zz = argsToArray(a);

              if (
                zz.length === 0 &&
                typeRep[key] &&
                typeof typeRep[key] !== 'function'
              ) {
                return Either.Right(typeRep[key]);
              } else if (zz.length === typeRep[key].length) {
                return Either.Right(apply(typeRep[key], zz));
              }

              throw `type ${typeRep['@@type']}.${key} expected ${typeRep[key].length} got ${zz.length}`;
            },
            RouteDuplex.end(routeDuplex).dec
          ),
        toPairs(rows)
      )
    )
  );

const product = (r1, r2) =>
  RouteDuplex(
    p => r1.enc(p.a).append(r2.enc(p.b)),
    r1.dec.map(a => b => Product(a, b)).ap(r2.dec)
  );

const parse = (routeDuplex, str) => Parser.run(routeDuplex.dec, str);

const print = (routeDuplex, o) => RoutePrinter.run(routeDuplex.enc(o));

const segment = RouteDuplex(RoutePrinter.put, Parser.take);

const prefix = (s, routeDuplex) =>
  RouteDuplex(
    a => RoutePrinter.put(s).append(routeDuplex.enc(a)),
    Parser.prefix(s, routeDuplex.dec)
  );

const suffix = (routeDuplex, s) =>
  RouteDuplex(
    a => routeDuplex.enc(a).append(RoutePrinter.put(s)),
    routeDuplex.dec.map(a => b => a).ap(Parser.prefix(s, RouteParser.of(unit)))
  );

const path = (s, routeDuplex) =>
  Id(s)
    .map(s => s.split('/'))
    .map(xs => reverse(xs))
    .map(xs => reduce((p, c) => prefix(c, p), routeDuplex, xs))
    .extract();

const root = c => path('', c);

const noArgs = RouteDuplex(
  a => RoutePrinter.empty,
  RouteParser.of(NoArguments())
);

const optional = r =>
  RouteDuplex(
    a => a.map(r.enc).reduce((p, c) => p.append(c), RoutePrinter.empty),
    Parser.optional(r.dec)
  );

export {
  RouteDuplex,
  noArgs,
  path,
  parse,
  prefix,
  suffix,
  print,
  segment,
  product,
  sum,
  Product,
  root,
  optional,
};
