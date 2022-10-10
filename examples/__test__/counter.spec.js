import fc from 'fast-check';
import setupEval from '../../src/testing/setupEval';
import {counterEvalFn, CounterAction} from '../test';

describe('Counter', () => {
  it('should handle Inc', () => {
    const {dispatch, putState} = setupEval(counterEvalFn);

    fc.assert(
      fc.property(fc.nat(), n => {
        putState({counter: n});

        return dispatch(CounterAction.inc).snd.counter === n + 1;
      })
    );
  });

  it('should handle Dec', () => {
    const {dispatch, putState} = setupEval(counterEvalFn);

    fc.assert(
      fc.property(fc.nat(), n => {
        putState({counter: n});

        return dispatch(CounterAction.dec).snd.counter === n - 1;
      })
    );
  });

  it('should handle IncBy', () => {
    const {dispatch, putState} = setupEval(counterEvalFn);

    fc.assert(
      fc.property(fc.nat(), fc.nat(), (initialValue, byValue) => {
        putState({counter: initialValue});

        return (
          dispatch(CounterAction.incBy(byValue)).snd.counter ===
          initialValue + byValue
        );
      })
    );
  });

  it('should handle Dec', () => {
    const {dispatch, putState} = setupEval(counterEvalFn);

    fc.assert(
      fc.property(fc.nat(), n => {
        putState({counter: n});

        return dispatch(CounterAction.reset).snd.counter === 0;
      })
    );
  });
});
