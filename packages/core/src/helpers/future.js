import * as F from 'fluture';
import {compose} from 'ramda';
import {tagged} from './daggy';

const FutureInt = tagged('Future', ['computation']);

const Future = compose(FutureInt, F.Future);

const resolve = value =>
  Future((reject, resolve) => {
    resolve(value);
    return () => {};
  });

const reject = value =>
  Future((reject, resolve) => {
    reject(value);
    return () => {};
  });

Future.of = resolve;
Future.resolve = resolve;
Future.reject = reject;

Future.encaseP = f => x => FutureInt(F.encaseP(f)(x));
Future.encase = f => x => FutureInt(F.encase(f)(x));
Future.attemptP = compose(FutureInt, F.attemptP);
Future.attempt = compose(FutureInt, F.attempt);
Future.after = ms => value => FutureInt(F.after(ms)(value));

FutureInt.prototype.map = function (fn) {
  return FutureInt(this.computation['fantasy-land/map'](fn));
};

FutureInt.prototype.chain = function (fn) {
  return FutureInt(
    this.computation['fantasy-land/chain'](x => fn(x).computation)
  );
};

FutureInt.prototype.fork = function (reject, resolve) {
  return F.fork(reject)(resolve)(this.computation);
};

FutureInt.prototype.coalesce = function (reject, resolve) {
  return FutureInt(F.coalesce(reject)(resolve)(this.computation));
};

export default Future;
