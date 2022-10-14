const next =
  (regen, ...args) =>
  data => {
    const gen = regen(...args);
    return gen.next(data), gen;
  };

const immutagen =
  regen =>
  (...args) =>
    (function loop(regen) {
      return (gen, data) => {
        const {value, done} = gen.next(data);
        if (done) return {value, next: null, mutable: gen};

        let replay = false;
        const recur = loop(next(regen, data));
        const mutable = () => (replay ? regen(data) : (replay = gen));
        const result = {value, next: value => recur(mutable(), value)};
        return Object.defineProperty(result, 'mutable', {get: mutable});
      };
    })(next(regen, ...args))(regen(...args));

export default immutagen;
