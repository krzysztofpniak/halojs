import daggy from 'daggy';
import Arrow from './arrow';

const Forget = daggy.tagged('Forget', ['typeRep', 'runWith']);

Forget.prototype.rmap = function (fn) {
  return Forget(this.typeRep, this.runWith);
};

Forget.prototype.dimap = function (l, r) {
  return Forget(this.typeRep, x => this.runWith(l(x)));
};

Forget.prototype.first = function () {
  return Forget(this.typeRep, x => this.runWith(x.fst));
};

Forget.prototype.right = function () {
  const empty = this.typeRep.empty();
  return Forget(this.typeRep, x =>
    x.cata({
      Left: z => empty,
      Right: z => this.runWith(z),
    })
  );
};

Forget.prototype.tap = function (fn) {
  fn(this.runWith);
  return this;
};

export default Forget;
