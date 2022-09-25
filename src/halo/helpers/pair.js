import daggy from 'daggy';
import {concat} from 'ramda';

const Pair = daggy.tagged('Pair', ['fst', 'snd']);

Pair.prototype.map = function (fn) {
  return Pair(this.fst, fn(this.snd));
};

Pair.prototype.lmap = function (fn) {
  return Pair(fn(this.fst), this.snd);
};

Pair.prototype.bimap = function (lfn, rfn) {
  return Pair(lfn(this.fst), rfn(this.snd));
};

Pair.prototype.chain = function (fn) {
  const p2 = fn(this.snd);
  return Pair(concat(this.fst, p2.fst), p2.snd);
};

Pair.prototype.pipe = function (fn) {
  return fn(this);
};

export default Pair;
