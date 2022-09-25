import daggy from 'daggy';
import {identity} from 'ramda';

const Either = daggy.taggedSum('Either', {Left: ['reason'], Right: ['result']});

Either.of = Either.Right;

Either.prototype['fantasy-land/of'] = Either.Right;

const either$map = function (f) {
  return this.cata({
    Left: () => this,
    Right: value => Either.Right(f(value)),
  });
};

const either$chain = function (f) {
  return this.cata({
    Left: () => this,
    Right: value => f(value),
  });
};

Either.prototype['map'] = either$map;
Either.prototype['fantasy-land/map'] = either$map;

Either.prototype['chain'] = either$chain;
Either.prototype['fantasy-land/chain'] = either$chain;

Either.prototype.fromEither = function (defaultValue) {
  return this.cata({Left: () => defaultValue, Right: identity});
};

export default Either;
