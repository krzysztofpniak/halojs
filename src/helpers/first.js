import Maybe from './maybe';
import {tagged} from './daggy';

const First = tagged('First', ['maybe']);

First.empty = () => First(Maybe.Nothing);

First.prototype.concat = function (other) {
  return this.maybe.cata({
    Just: x => First(this.maybe),
    Nothing: () => other,
  });
};

First.prototype.empty = First.empty;

export default First;
