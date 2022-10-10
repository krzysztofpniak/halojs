import Either from './either';
import Pair from './pair';
import {tagged} from './daggy';

const Arrow = tagged('Arrow', ['runWith']);

Arrow.prototype.map = function (fn) {
  return Arrow(x => fn(this.runWith(x)));
};

Arrow.prototype.rmap = function (fn) {
  return Arrow(x => fn(this.runWith(x)));
};

Arrow.prototype.compose = function (m) {
  return Arrow(x => m.runWith(this.runWith(x)));
};

Arrow.prototype.contramap = function (fn) {
  return Arrow(x => this.runWith(fn(x)));
};

Arrow.prototype.dimap = function (l, r) {
  return Arrow(x => r(this.runWith(l(x))));
};

Arrow.prototype.left = function () {
  return Arrow(x =>
    x.cata({
      Left: a => Either.Left(this.runWith(a)),
      Right: c => Either.Right(c),
    })
  );
};

Arrow.prototype.right = function () {
  return Arrow(x => x.map(this.runWith));
};

Arrow.prototype.first = function () {
  return Arrow(x => Pair(this.runWith(x.fst), x.snd));
};

Arrow.prototype.second = function () {
  return Arrow(x => x.map(this.runWith));
};

Arrow.prototype.tap = function (fn) {
  fn(this.runWith);
  return this;
};

export default Arrow;
