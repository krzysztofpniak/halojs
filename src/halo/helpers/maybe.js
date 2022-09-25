import daggy from 'daggy';
import {identity} from 'ramda';

const Maybe = daggy.taggedSum('Maybe', {Nothing: [], Just: ['value']});

Maybe.of = Maybe.Just;

Maybe.prototype['fantasy-land/of'] = Maybe.Just;

const maybe$map = function (f) {
  return this.cata({
    Nothing: () => this,
    Just: value => Maybe.Just(f(value)),
  });
};

const maybe$chain = function (f) {
  return this.cata({
    Nothing: () => this,
    Just: value => f(value),
  });
};

Maybe.prototype['map'] = maybe$map;
Maybe.prototype['fantasy-land/map'] = maybe$map;

Maybe.prototype['chain'] = maybe$chain;
Maybe.prototype['fantasy-land/chain'] = maybe$chain;

Maybe.prototype.reduce = function (fn, x) {
  return this.cata({Nothing: () => x, Just: v => fn(x, v)});
};

Maybe.prototype.fromMaybe = function (defaultValue) {
  return this.cata({Nothing: () => defaultValue, Just: identity});
};

Maybe.prototype.isJust = function () {
  return this.cata({
    Nothing: () => false,
    Just: () => true,
  });
};

export default Maybe;
