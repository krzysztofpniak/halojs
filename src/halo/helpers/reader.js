import daggy from 'daggy';
import {compose, identity} from 'ramda';

const Reader = daggy.tagged('Reader', ['runReader']);

Reader.of = x => Reader(() => x);

Reader.ask = Reader(identity);

Reader.prototype.map = function (runReader) {
  return Reader(compose(runReader, this.runReader));
};

Reader.prototype.chain = function (runReader) {
  return Reader(e => runReader(this.runReader(e)).runReader(e));
};

export default Reader;
