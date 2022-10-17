import {HalogenQ} from '../halo';
import Pair from '../helpers/pair';
import show from '../helpers/show';
import {compare} from 'fast-json-patch';

const interpret2 =
  ({stateRef, appEffectsRef}) =>
  x =>
    x.cata({
      State: fn => {
        const prev = stateRef.current;
        const next = fn(prev);
        stateRef.current = next;
        const diff = compare(prev, next);
        return Pair([`State: ${show(stateRef.current)}`], stateRef.current);
      },
      Lift: () => 'df',
      Subscribe: () => 'ds',
      Unsubscribe: () => '',
      Raise: () => 'asd',
      Fork: a =>
        a.foldMap(interpret2({stateRef, appEffectsRef}), x => Pair([], x)),
      ChildQuery: (a, b, c) => Pair([`ChildQuery: ${a}.${b}.${c}`], ''),
      GetStore: () => Pair(['GetStore'], ['ads']),
      GetNavigator: () => Pair(['GetNavigator'], ['ads']),
      Navigate: () => Pair(['Navigate'], ['ads']),
      ...appEffectsRef.current,
    });

const setupEval = evalFn => {
  const stateRef = {current: null};
  const appEffectsRef = {current: {}};

  return {
    getState: () => {
      return stateRef.current;
    },
    putState: value => {
      stateRef.current = {...value};
    },
    addEffects: effects => {
      appEffectsRef.current = {...appEffectsRef.current, ...effects};
    },
    initialize: () =>
      evalFn(HalogenQ.Initialize).foldMap(
        interpret2({stateRef, appEffectsRef}),
        x => Pair([], x)
      ),
    dispatch: action =>
      evalFn(HalogenQ.Action(action)).foldMap(
        interpret2({stateRef, appEffectsRef}),
        x => Pair([], x)
      ),
  };
};

export default setupEval;
