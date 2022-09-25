import {always, curry, identity, reduce, splitAt} from 'ramda';
import Maybe from './maybe';
import {renderToStaticMarkup} from 'react-dom/server';
import daggy from 'daggy';
import Arrow from './arrow';
import First from './first';
import Forget from './forget';
import Id from './id';

const uncons = str => {
  const [head, tail] = splitAt(1)(str);
  return Array.isArray(str)
    ? head.length === 0
      ? Maybe.Nothing
      : Maybe.Just({head: head[0], tail})
    : head === ''
    ? Maybe.Nothing
    : Maybe.Just({head, tail});
};

const head = arr => (arr.length > 0 ? Maybe.Just(arr[0]) : Maybe.Nothing);

const find = pred => xs => {
  for (let i = 0; i < xs.length; i++) {
    if (pred(xs[i])) {
      return Maybe.Just(xs[i]);
    }
  }

  return Maybe.Nothing;
};

const unfold = f => seed => {
  const result = [];
  let acc = seed;
  let go = true;

  while (go) {
    f(seed).cata({
      Nothing: () => {
        go = false;
      },
      Just: ([v, a]) => {
        result.push(v);
        acc = a;
      },
    });
  }

  return result;
};

const Unit = daggy.tagged('Unit', []);

const unit = Unit();

const when = typeRep => b => m => b ? m : typeRep(unit);

//foldMapOf :: forall s t a b r. Fold r s t a b -> (a -> r) -> s -> r
//foldMapOf = under Forget

const foldMapOf = curry((p, m, s) => p(m)(s));

//preview p = unwrap <<< foldMapOf p (First <<< Just)
const preview = curry(
  (p, d) =>
    foldMapOf(
      p,
      Forget(First, a => First(Maybe.Just(a))),
      d
    ).maybe
);

//10^6 * 1t
//1t = 1Mg

const foldMap = curry((typeRep, f, a) =>
  reduce((p, c) => p.concat(f(c)), typeRep.empty(), a)
);

//folded :: forall g a b t r. Monoid r => Foldable g => Fold r (g a) b a t
const folded = curry((typeRep, a, d) =>
  Forget(typeRep, foldMap(typeRep, a)).runWith(d)
);

const view = curry((p, d) => p(Forget(Id, identity))(d));

const over = curry((l, f, d) => l(Arrow(f))(d));

const set = curry((l, b, d) => over(l, always(b), d));

export {
  uncons,
  head,
  find,
  unfold,
  when,
  preview,
  view,
  set,
  over,
  foldMapOf,
  folded,
  Unit,
  unit,
};
