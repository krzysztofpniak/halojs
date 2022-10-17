import {tagged} from './daggy';

const Sum = tagged('Sum', ['value']);

Sum.empty = () => Sum(0);

Sum.prototype.concat = function (other) {
  return Sum(other.value + this.value);
};

Sum.prototype.empty = Sum.empty;

export default Sum;
