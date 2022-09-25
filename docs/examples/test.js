import React from 'react';
import {H, mkComponent, mkEval, taggedSum} from '../../src/halo/halo';
import {add, always, evolve} from 'ramda';

const Action = taggedSum('Action', {
  inc: [],
  dec: [],
  incBy: ['step'],
  Reset: [],
});

const handleAction = action =>
  action.cata({
    inc: () => H.modify(evolve({counter: add(1)})),
    dec: () => H.modify(evolve({counter: add(-1)})),
    incBy: step => H.modify(evolve({counter: add(step)})),
    Reset: () => H.modify(evolve({counter: always(0)})),
  });

const Counter = mkComponent({
  initialState: always({counter: 0}),
  actionType: Action,
  evalFn: mkEval({
    handleAction,
  }),
})(({counter, inc, dec, incBy, Reset}) => (
  <div className="flex gap-1 example my-5">
    <button onClick={dec}>Dec</button>
    <div className="py-2 px-3">{counter}</div>
    <button onClick={inc}>Inc</button>
    <button onClick={() => incBy(5)}>Inc by 5</button>
    <button onClick={Reset}>Reset</button>
  </div>
));

Counter.displayName = 'Counter';

export default Counter;
