import React from 'react';
import {H, mkComponent, mkEval, taggedSum} from '../../core/src/halo';
import {add, always, evolve} from 'ramda';

const CounterAction = taggedSum('Action', {
  inc: [],
  dec: [],
  incBy: ['step'],
  reset: [],
});

const handleAction = action =>
  action.cata({
    inc: () => H.modify(evolve({counter: add(1)})),
    dec: () => H.modify(evolve({counter: add(-1)})),
    incBy: step => H.modify(evolve({counter: add(step)})),
    reset: () => H.modify(evolve({counter: always(0)})),
  });

const counterEvalFn = mkEval({
  handleAction,
});

const Counter = mkComponent({
  initialState: always({counter: 0}),
  actionType: CounterAction,
  evalFn: counterEvalFn,
})(({counter, inc, dec, incBy, reset}) => (
  <div className="flex gap-1 example my-5">
    <button onClick={dec}>Dec</button>
    <div className="py-2 px-3">{counter}</div>
    <button onClick={inc}>Inc</button>
    <button onClick={() => incBy(5)}>Inc by 5</button>
    <button onClick={reset}>Reset</button>
  </div>
));

Counter.displayName = 'Counter';

export default Counter;

export {CounterAction, counterEvalFn};
