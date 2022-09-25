import React, {useEffect, useState} from 'react';
import {H, mkComponent, mkEval} from '../halo';
import {add, always, evolve} from 'ramda';
import daggy from 'daggy';

const Action = daggy.taggedSum('Action', {
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
  <div style={{display: 'flex'}}>
    <button onClick={dec}>Dec</button>
    <pre>{counter}</pre>
    <button onClick={inc}>Inc</button>
    <button onClick={() => incBy(5)}>Inc by 5</button>
    <button onClick={Reset}>Reset</button>
  </div>
));

Counter.displayName = 'Counter';

export default {
  title: 'Counter',
  component: Counter,
};

export const Primary = () => <Counter />;
