import {Free, liftF} from './helpers/free';
import {
  always,
  assoc,
  assocPath,
  curry,
  dissoc,
  equals,
  find,
  fromPairs,
  identity,
  map,
  pipe,
} from 'ramda';
import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Maybe from './helpers/maybe';
import go from './helpers/go';
import Emitter from './helpers/emitter';
import Future from './helpers/future';
import './helpers/request';
import {print} from './helpers/routeDuplex/routeduplex.js';
import {unit} from './helpers/fns';
import Ref from './helpers/ref';
import {tagged, taggedSum} from './helpers/daggy';

const HalogenQ = taggedSum('HalogenQ', {
  Initialize: [],
  Action: ['action'],
  Receive: ['input'],
  Query: ['query'],
});

const HalogenF = taggedSum('HalogenF', {
  State: ['fn'],
  Lift: ['future'],
  Subscribe: ['esc'],
  Unsubscribe: ['sid'],
  Raise: ['action'],
  Fork: ['action'],
  ChildQuery: ['type', 'id', 'query'],
  GetStore: [],
  GetNavigator: [],
  Navigate: ['route'],
});

const ForkId = tagged('ForkId', ['id']);
const SubscriptionId = tagged('SubscriptionId', ['id']);

const modify = fn => liftF(HalogenF.State(fn));
const put = state => liftF(HalogenF.State(always(state)));
const get = () => liftF(HalogenF.State(identity));
const gets = selector => liftF(HalogenF.State(selector));
const subscribe = es => liftF(HalogenF.Subscribe(() => es));
const unsubscribe = sid => liftF(HalogenF.Unsubscribe(sid));
const raise = action => liftF(HalogenF.Raise(action));
const liftFuture = future => liftF(HalogenF.Lift(future));

const createSub = Future((reject, resolve) => {
  let subscribers = [];

  resolve({
    emitter: Emitter(k => {
      subscribers.push(k);
      return () => {
        subscribers = subscribers.filter(x => x !== k);
      };
    }),
    listener: a => {
      subscribers.forEach(k => k(a));
    },
  });

  return () => {};
});

const defaultHaloContext = {
  raise: action => console.error('component not embedded in Slot'),
  registerChild: x => console.error('component not embedded in Slot'),
  store: 1,
  interpreters: [],
  navigator: {},
};

const HaloContext = createContext(defaultHaloContext);

const H = {
  of: Free.of,
  modify,
  put,
  get,
  gets,
  subscribe,
  unsubscribe,
  raise,
  fork: hm => liftF(HalogenF.Fork(hm)),
  liftFuture,
  query: type => id => query => liftF(HalogenF.ChildQuery(type, id, query)),
  getStore: () => liftF(HalogenF.GetStore),
  getNavigator: () => liftF(HalogenF.GetNavigator),
  navigate: route => liftF(HalogenF.Navigate(route)),
};

const useEqualsEffect = (effect, inputs) => {
  const prev = useRef(null);
  const prevDispose = useRef(null);

  if (!equals(inputs, prev.current)) {
    if (typeof prevDispose.current === 'function') {
      prevDispose.current();
    }
    prevDispose.current = effect();
  }

  prev.current = inputs;
};

const fresh = curry((f, ref) =>
  go(function* () {
    const st = yield ref.read();
    return st.fresh.modify1(i => ({state: i + 1, value: f(i)}));
  })
);

const interpret =
  ({
    setState,
    dispatch,
    onRaised,
    childrenComponents,
    interpreters,
    store,
    navigator,
    routeCodec,
    ref,
  }) =>
  command => {
    const x = find(i => i[0].is(command), interpreters);
    if (x) {
      return x[1](command);
    }

    return command.cata({
      State: fn =>
        go(function* () {
          const z = yield fresh(ForkId, ref);
          return Future.attempt(() => setState(fn));
        }),
      Lift: f => f,
      Subscribe: es =>
        go(function* () {
          const sid = yield fresh(SubscriptionId, ref);
          const emitter = es();

          const unsubscribe = yield Future.attempt(() =>
            emitter.subscribe(dispatch)
          );

          const {subscriptions} = yield ref.read();
          yield subscriptions.modify(assoc(sid, unsubscribe));

          return Future.of(sid);
        }),
      Unsubscribe: sid =>
        go(function* () {
          const {subscriptions} = yield ref.read();
          const s = yield subscriptions.read();
          yield Future.attempt(() => s[sid]());
          yield subscriptions.modify(dissoc(sid));
          return Future.of('');
        }),
      Raise: action => Future.attempt(() => onRaised(action)),
      Fork: m =>
        Future.attempt(() =>
          forkM({
            setState,
            dispatch,
            onRaised,
            childrenComponents,
            interpreters,
            store,
            navigator,
            ref,
          })(m)
        ),
      ChildQuery: (type, id, query) =>
        Future.attempt(() =>
          childrenComponents.current[type][id].current.evalWithContext(
            HalogenQ.Query(query)
          )
        ),
      GetStore: () => Future.attempt(() => store),
      GetNavigator: () => Future.attempt(() => navigator),
      Navigate: route =>
        Future.attempt(() => navigator.pushState(print(routeCodec, route))),
    });
  };

const forkM = env => m =>
  m.foldMap(interpret(env), Future.resolve).fork(console.error, identity);

const mkEval =
  ({handleAction, initialize, receive, handleQuery}) =>
  q =>
    q.cata({
      Initialize: () => (initialize ? handleAction(initialize) : Free.of(unit)),
      Receive: input =>
        receive && receive(input)
          ? handleAction(receive(input))
          : Free.of(unit),
      Action: handleAction,
      Query: q => handleQuery(q),
    });

const Link = ({href, children, content, ...rest}) => {
  const {
    navigator: {pushState},
  } = useContext(HaloContext);

  const handleClick = e => {
    e.preventDefault();
    pushState(href);
  };
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {content || children}
    </a>
  );
};

const initDriverState = () => {
  const selfRef = Ref({});
  const fresh = Ref(1);
  const subscriptions = Ref({});
  const forks = Ref({});

  selfRef.value = {
    selfRef,
    fresh,
    subscriptions,
    forks,
  };

  return selfRef;
};

const mkComponent =
  ({evalFn, actionType, initialState = identity}) =>
  Component => {
    const HaloComponent = props => {
      const initialStateInt = useMemo(() => initialState(props), []);

      const [s, sV] = useState(initialStateInt);
      const sRef = useRef(initialStateInt);

      const setState = useCallback(fn => {
        sRef.current = fn(sRef.current);
        sV(sRef.current);
        return sRef.current;
      }, []);

      const [childrenComponents, setChildrenComponentsInt] = useState({});
      const childrenComponentsRef = useRef({});

      const setChildrenComponents = useCallback(fn => {
        childrenComponentsRef.current = fn(childrenComponentsRef.current);
        setChildrenComponentsInt(childrenComponentsRef.current);
        return childrenComponentsRef.current;
      }, []);

      const {
        raise: onRaised,
        registerChild,
        store,
        interpreters,
        navigator,
        routeCodec,
      } = useContext(HaloContext);

      const ref = useMemo(() => initDriverState(), []);

      const evalWithContext = useCallback(
        m =>
          forkM({
            setState,
            dispatch,
            onRaised,
            store,
            interpreters,
            navigator,
            routeCodec,
            ref,
            childrenComponents: childrenComponentsRef,
          })(evalFn(m)),
        []
      );

      const selfRef = useRef({evalFn, evalWithContext});
      useEffect(() => {
        registerChild(selfRef);
      }, []);

      const dispatch = useCallback(action => {
        evalWithContext(HalogenQ.Action(action));
      }, []);

      useEqualsEffect(() => {
        evalWithContext(HalogenQ.Receive(props));
      }, [props]);

      useEffect(() => {
        evalWithContext(HalogenQ.Initialize);
      }, []);

      const boundActions = useMemo(
        () =>
          pipe(
            map(t => [
              t,
              (...args) =>
                dispatch(
                  typeof actionType[t] === 'function'
                    ? actionType[t](...args)
                    : actionType[t]
                ),
            ]),
            fromPairs
          )(actionType['@@tags']),
        [actionType]
      );

      const Slot = useMemo(
        () =>
          ({component, output, slotType, slotId, ...rest}) =>
            (
              <HaloContext.Provider
                value={{
                  store,
                  interpreters,
                  raise: x => dispatch(output(x)),
                  navigator,
                  routeCodec,
                  registerChild: c =>
                    setChildrenComponents(assocPath([slotType, slotId], c)),
                }}
              >
                {createElement(component, rest)}
              </HaloContext.Provider>
            ),
        []
      );

      const bound = {
        dispatch,
        ...boundActions,
        Slot,
      };

      return <Component {...bound} {...sRef.current} />;
    };

    HaloComponent.evalFn = evalFn;
    HaloComponent.render = Component;

    return HaloComponent;
  };

const ConnectAction = taggedSum('ConnectAction', {
  Initialize: [],
  Receive: ['input'],
  Update: ['context'],
  Raise: ['output'],
});

const connect = selector => Component =>
  mkComponent({
    initialState: input => ({
      context: Maybe.Nothing,
      input,
    }),
    actionType: ConnectAction,
    evalFn: mkEval({
      initialize: ConnectAction.Initialize,
      receive: ConnectAction.Receive,
      handleAction: a =>
        a.cata({
          Initialize: () =>
            go(function* () {
              const store = yield H.getStore();
              yield H.modify(assoc('context', Maybe.Just(store.getState())));
              return H.subscribe(store.emitter.map(ConnectAction.Update));
            }),
          Receive: input => H.modify(assoc('input', input)),
          Update: state => H.modify(assoc('context', Maybe.Just(state))),
          Raise: () => 'd',
        }),
    }),
  })(props =>
    props.context.cata({
      Nothing: () => '',
      Just: context => <Component {...context} {...props.input} />,
    })
  );

const createStore = (reducer, initialState) => {
  let state = initialState;

  return createSub['map'](({emitter, listener}) => ({
    getState: () => state,
    dispatch: action =>
      Future.attempt(() => {
        state = reducer(action, state);
        listener(state);
      }),
    emitter,
  }));
};

const createNavigator = createSub.map(({emitter, listener}) => {
  const pushState = url => {
    listener(url);
    window.history.pushState({}, '', url);
  };
  return {emitter, pushState};
});

const createHaloProvider = ({
  initialState,
  reducer,
  interpreters = [],
  routeCodec,
}) =>
  go(function* () {
    const {pushState, emitter} = yield createNavigator;
    console.log('emitter', emitter);

    return createStore(reducer, initialState).map(store => ({children}) => {
      const data = {
        store,
        interpreters,
        raise: action => {},
        registerChild: x => {},
        navigator: {pushState, emitter},
        routeCodec,
      };

      return (
        <HaloContext.Provider value={data}>{children}</HaloContext.Provider>
      );
    });
  });

const HaloProvider = ({
  navigator,
  store,
  interpreters = [],
  routeCodec,
  children,
}) => {
  const data = {
    store,
    interpreters,
    raise: action => {},
    registerChild: x => {},
    navigator,
    routeCodec,
  };

  return <HaloContext.Provider value={data}>{children}</HaloContext.Provider>;
};

export {
  mkEval,
  mkComponent,
  createSub,
  H,
  HaloContext,
  connect,
  createHaloProvider,
  HaloProvider,
  Link,
  HalogenQ,
  createNavigator,
  createStore,
  Emitter,
  tagged,
  taggedSum,
};
