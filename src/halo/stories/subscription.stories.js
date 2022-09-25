import React from 'react';
import {createSub, H, mkComponent, mkEval} from '../halo';
import {add, always, assoc, chain, evolve} from 'ramda';
import daggy from 'daggy';
import Future from '../helpers/future';
import Maybe from '../helpers/maybe';
import show from 'sanctuary-show';
import go from '../helpers/go';

const Action = daggy.taggedSum('Action', {
  Tick: [],
  Stop: ['sid'],
  Start: [],
});

const timer = data =>
  go(function* () {
    const {emitter, listener} = yield createSub;
    console.log('e', emitter);

    return Future((reject, resolve) => {
      const timerId = setInterval(() => listener(data), 20);

      resolve(emitter);

      return () => clearInterval(timerId);
    });
  });

const handleAction = action =>
  action.cata({
    Start: () =>
      go(function* () {
        const emitter = yield H.liftFuture(timer(Action.Tick));
        const sid = yield H.subscribe(emitter);
        return H.modify(assoc('sid', Maybe.Just(sid)));
      }),
    Tick: () => H.modify(evolve({counter: add(1)})),
    Stop: sid =>
      go(function* () {
        yield H.unsubscribe(sid);
        return H.modify(assoc('sid', Maybe.Nothing));
      }),
  });

const Timer = mkComponent({
  initialState: always({counter: 0, sid: Maybe.Nothing}),
  actionType: Action,
  evalFn: mkEval({
    handleAction,
    initialize: Action.Start,
  }),
})(({counter, sid, Start, Stop}) => (
  <div>
    <pre>{counter}</pre>
    <pre>{show(sid)}</pre>
    {sid.cata({
      Nothing: () => <button onClick={Start}>Start</button>,
      Just: sid => <button onClick={() => Stop(sid)}>Stop</button>,
    })}
  </div>
));

export default {
  title: 'Timer',
  component: Timer,
};

export const Primary = () => <Timer />;
