import daggy from 'daggy';
import {compose} from 'ramda';

const Emitter = daggy.tagged('Emitter', ['emitter']);

Emitter.prototype.map = function (fn) {
  return Emitter(k => this.emitter(compose(k, fn)));
};

Emitter.prototype.subscribe = function (fn) {
  return this.emitter(fn);
};

export default Emitter;
