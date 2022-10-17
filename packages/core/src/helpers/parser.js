import {append, drop, map, match, splitAt, takeWhile} from 'ramda';
import Maybe from './maybe';
import go from './go';
import {uncons} from './fns';
import {tagged, taggedSum} from './daggy';

const Parser = tagged('Parser', ['fn']);

const done = function (value) {
  return Parser((state1, more, lift, error, done) => done(state1, value));
};

Parser.prototype['fantasy-land/of'] = done;
Parser.of = done;

Parser.prototype.map = Parser.prototype['fantasy-land/map'] = function (fn) {
  return Parser((state1, more, lift, error, done) =>
    more(() =>
      this.fn(state1, more, lift, error, (state2, a) =>
        more(() => done(state2, fn(a)))
      )
    )
  );
};

Parser.prototype.chain = Parser.prototype['fantasy-land/chain'] = function (
  next
) {
  return Parser((state1, more, lift, error, done) =>
    more(() =>
      this.fn(state1, more, lift, error, (state2, a) =>
        more(() => {
          const r = next(a);
          const k2 = r;
          return k2.fn(state2, more, lift, error, done);
        })
      )
    )
  );
};

Parser.prototype.alt = function (next) {
  return Parser((state1, more, lift, error, done) =>
    more(() =>
      this.fn(
        ParseState(state1.input, state1.position, false),
        more,
        lift,
        (state2, err) =>
          more(() =>
            state2.consumed
              ? error(state2, err)
              : next.fn(state1, more, lift, error, done)
          ),
        done
      )
    )
  );
};

const RunParser = taggedSum('RunParser', {
  More: ['step'],
  Lift: ['m'],
  Stop: ['state', 'result'],
});

const Either = taggedSum('Either', {Left: ['a'], Right: ['b']});

const Step = taggedSum('Step', {Loop: ['a'], Done: ['b']});

const ParseError = tagged('ParseError', ['message', 'position']);

const ParseState = tagged('ParseState', ['input', 'position', 'consumed']);

const Position = tagged('Position', ['index', 'line', 'column']);
const initialPos = Position(0, 1, 1);

const satisfy = fn =>
  Parser((state1, more, lift, error, done) =>
    error(state1, ParseError('Unexpected EOF', state1.position))
  );

const stripPrefix = prefix => input => {
  let [before, after] = splitAt(prefix.length)(input);
  return before === prefix ? Maybe.Just(after) : Maybe.Nothing;
};

const updatePosSingle = (pos, cp, after) => {
  const x = cp.codePointAt(0);
  return x === 10
    ? Position(pos.index + 1, pos.line + 1, 1) // "\n"
    : x === 13 && after.codePointAt(0) === 10
    ? Position(pos.index + 1, pos.line, pos.column) // "\r\n" lookahead
    : x === 13
    ? Position(pos.index + 1, pos.line + 1, 1) // "\r"
    : x === 9
    ? Position(pos.index + 1, pos.line, pos.column + 8 - ((pos.column - 1) % 8)) // "\t" Who says that one tab is 8 columns?
    : Position(pos.index + 1, pos.line, pos.column + 1);
};

const updatePosString = (pos, before, after) =>
  uncons(before).cata({
    Nothing: () => pos,
    Just: ({head, tail}) => {
      const newPos =
        tail === ''
          ? updatePosSingle(pos, head, after)
          : updatePosSingle(pos, head, tail);
      return updatePosString(newPos, tail, after);
    },
  });

const consumeWith = f =>
  Parser((state1, more, lift, error, done) =>
    f(state1.input).cata({
      Left: err => error(state1, ParseError(err, state1.position)),
      Right: ({value, consumed, remainder}) =>
        done(
          ParseState(
            remainder,
            updatePosString(state1.position, consumed, remainder),
            true
          ),
          value
        ),
    })
  );

const tryP = p =>
  Parser((state1, more, lift, error, done) =>
    p.fn(
      state1,
      more,
      lift,
      (state2, err) =>
        error(ParseState(state2.input, state2.position, state1.consumed)),
      done
    )
  );

const regex = pattern =>
  consumeWith(input => {
    const res = match(new RegExp('^' + pattern), input);
    return res.length > 0
      ? Either.Right({
          value: res[0],
          consumed: res[0],
          remainder: drop(res[0].length, input),
        })
      : Either.Left('No Regex pattern match');
  });

const isSpace = c =>
  c === ' ' ||
  c === '\n' ||
  c === '\t' ||
  c === '\r' ||
  c === '\f' ||
  c === '\v' ||
  c === '\u00a0' ||
  c === '\u1680' ||
  c === '\u2000' ||
  c === '\u200a' ||
  c === '\u2028' ||
  c === '\u2029' ||
  c === '\u202f' ||
  c === '\u205f' ||
  c === '\u3000' ||
  c === '\ufeff';

const skipSpaces = consumeWith(input => {
  let consumed = takeWhile(isSpace, input);
  let remainder = drop(consumed.length, input);
  return Either.Right({value: consumed, consumed, remainder});
});

const str = s =>
  consumeWith(input =>
    stripPrefix(s)(input).cata({
      Just: remainder => Either.Right({value: s, consumed: s, remainder}),
      Nothing: () => Either.Left('Expected ' + s),
    })
  );

const chainRecx = (next, initArg) =>
  Parser((state1, more, lift, error, done) => {
    const loop = (state2, arg, gas) => {
      const k1 = next(arg);
      return k1.fn(state2, more, lift, error, (state3, step) =>
        step.cata({
          Loop: nextArg =>
            gas === 0
              ? more(() => loop(state3, nextArg, 30))
              : loop(state3, nextArg, gas - 1),
          Done: res => done(state3, res),
        })
      );
    };

    return loop(state1, initArg, 30);
  });

const runParserTIntGo = step =>
  step().cata({
    More: next => runParserTIntGo(next),
    Lift: m => map(Step.Loop, m),
    Stop: (s, res) => Step.Done([res, s]),
  });

const tailRec = go => init => {
  let res = null;
  let arg = init;
  do {
    res = go(arg);
    if (Step.Loop.is(res)) {
      arg = res.a;
    }
  } while (!Step.Done.is(res));

  return res.b;
};

const manyRec = p =>
  chainRecx(
    acc =>
      p
        .map(Step.Loop)
        .alt(done('').map(Step.Done))
        .map(x =>
          x.cata({
            Loop: e => Step.Loop(append(e, acc)),
            Done: x => Step.Done(acc),
          })
        ),
    []
  );

const runParserTInt = (state1, parser) =>
  tailRec(runParserTIntGo)(() =>
    parser.fn(
      state1,
      RunParser.More,
      RunParser.Lift,
      (state2, err) => RunParser.Stop(state2, Either.Left(err)),
      (state2, res) => RunParser.Stop(state2, Either.Right(res))
    )
  );

const runParserT = p => s => runParserTInt(ParseState(s, initialPos, false), p);

const r2 = str('abc/').chain(() =>
  regex('\\w+').chain(x => str('/fav').map(() => `second(${x})`))
);

const r1 = go(function* () {
  yield str('abc/');
  const x = yield regex('\\w+');
  yield str('/fav');
  return done(`second(${x})`);
});

const r3 = str('abc/')
  .chain(() => regex('\\w+'))
  .map(x => `first(${x})`);

const testP = tryP(r1).alt(tryP(r3));

console.log(`${runParserT(testP)('abc/4/fav')}`);

export {
  Parser,
  satisfy,
  ParseError,
  ParseState,
  runParserT,
  str,
  skipSpaces,
  regex,
  manyRec,
  done,
};
