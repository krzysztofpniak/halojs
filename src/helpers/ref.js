import Future from './future';
import {tagged} from './daggy';

const Ref = tagged('Ref', ['value']);

Ref.new = value => Future.attempt(() => Ref(value));

Ref.prototype.read = function () {
  return Future.attempt(() => this.value);
};

Ref.prototype.write = function (value) {
  return Future.attempt(() => (this.value = value));
};

Ref.prototype.modify1 = function (f) {
  return Future.attempt(() => {
    const t = f(this.value);
    this.value = t.state;
    return t.value;
  });
};

Ref.prototype.modify = function (f) {
  return Future.attempt(() => (this.value = f(this.value)));
};

export default Ref;
