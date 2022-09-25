import {concat, join, map, toPairs, when} from 'ramda';
import daggy from 'daggy';

const Id = daggy.tagged('Id', ['value']);

Id.prototype.pipe = function (fn) {
  return Id(fn(this.value));
};

const toQuery = z =>
  Id(z)
    .pipe(toPairs)
    .pipe(map(([key, value]) => `${key}=${value}`))
    .pipe(join('&'))
    .pipe(when(x => x.length > 0, concat('?'))).value;

export default toQuery;
