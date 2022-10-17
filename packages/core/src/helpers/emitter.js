import {compose} from 'ramda';
import {tagged} from './daggy';

const Emitter = tagged('Emitter', ['emitter']);

Emitter.prototype.map = function (fn) {
  return Emitter(k => this.emitter(compose(k, fn)));
};

Emitter.prototype.subscribe = function (fn) {
  return this.emitter(fn);
};

export default Emitter;
