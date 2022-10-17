import {append, compose, equals, evolve, identity} from 'ramda';
import Id from '../id';
import Pair from '../pair';
import {tagged} from '../daggy';

const RoutePrinter = tagged('RoutePrinter', ['printer']);

RoutePrinter.prototype.append = function (other) {
  return RoutePrinter(compose(other.printer, this.printer));
};

RoutePrinter.empty = RoutePrinter(identity);

RoutePrinter.put = str => RoutePrinter(evolve({segments: append(str)}));

RoutePrinter.param = k => v =>
  RoutePrinter(evolve({params: append(Pair(k, v))}));

const printSegments = segments =>
  equals(segments, ['']) ? '/' : segments.map(encodeURIComponent).join('/');

RoutePrinter.run = a =>
  Id({segments: [], params: []})
    .map(a.printer)
    .map(
      ({segments, params}) =>
        printSegments(segments) +
        (params.length > 0
          ? `?${params
              .map(
                ({fst, snd}) =>
                  `${encodeURIComponent(fst)}=${encodeURIComponent(snd)}`
              )
              .join('&')}`
          : '')
    )
    .extract();

export default RoutePrinter;
