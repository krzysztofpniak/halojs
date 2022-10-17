import {tagged} from './daggy';

const ST = tagged('ST', ['value']);

const STRef = tagged('STRef', ['value']);

ST.of = value => ST(() => value);

ST.new = value => ST(() => STRef(value));

ST.write = (value, ref) =>
  ST(() => {
    return (ref.value = value);
  });

ST.read = ref => ST(() => ref.value);

ST.prototype.chain = function (fn) {
  return fn(this.value());
};

ST.prototype.run = function () {
  return this.value();
};

export default ST;
