import React, {useMemo, useState} from 'react';
import {
  H,
  HaloProvider,
  Link,
  mkComponent,
  mkEval,
  taggedSum,
} from '../src/halo';
import {FakeBrowser} from '@vtaits/react-fake-browser-ui';
import Emitter from '../src/helpers/emitter';
import {
  noArgs,
  optional,
  path,
  root,
  RouteDuplex,
  sum,
} from '../src/helpers/routeDuplex/routeduplex';
import go from '../src/helpers/go';
import {mergeLeft} from 'ramda';

const Routes = taggedSum('Routes', {
  Home: [],
  Login: ['params'],
});

const routeCodec = root(
  sum(Routes)({
    Home: noArgs,
    Login: path(
      'login',
      RouteDuplex.params({
        search: optional,
      })
    ),
  })
);

const createFakeBrowserDecorator = routeCodec => Story => {
  const [currentAddress, setCurrentAddress] = useState('/');
  const sub = useMemo(() => createSub2(), []);
  const navigator = {
    pushState: x => {
      setCurrentAddress(x);
      sub.listener(x);
    },
    emitter: sub.emitter,
  };

  return (
    <FakeBrowser
      currentAddress={currentAddress}
      goTo={navigator.pushState}
      canMoveBack={false}
    >
      <HaloProvider navigator={navigator} routeCodec={routeCodec}>
        <Story />
      </HaloProvider>
    </FakeBrowser>
  );
};

export default {
  title: 'Router',
  component: Router,
  decorators: [createFakeBrowserDecorator(routeCodec)],
};

const createSub2 = () => {
  let subscribers = [];

  return {
    emitter: Emitter(k => {
      subscribers.push(k);
      return () => {
        subscribers = subscribers.filter(x => x !== k);
      };
    }),
    listener: a => {
      subscribers.forEach(k => k(a));
    },
  };
};

const LoginAction = taggedSum('LoginAction', {
  Receive: ['input'],
  SetValue: ['value'],
});

const Login = mkComponent({
  actionType: LoginAction,
  initialState: ({search}) =>
    console.log('init', search) || H.modify(mergeLeft({search})),
  evalFn: mkEval({
    receive: LoginAction.Receive,
    handleAction: action =>
      action.cata({
        Receive: input => H.modify(mergeLeft(input)),
        SetValue: value =>
          go(function* () {
            const nav = yield H.getNavigator();
            nav.pushState(`/login?search=${value}`);
            return H.of('');
          }),
      }),
  }),
})(({search, SetValue}) => (
  <input
    value={search.fromMaybe('')}
    onChange={e => SetValue(e.target.value)}
  />
));

export const Primary = () => (
  <div>
    <ul>
      <li>
        <Link href="/" content="Home" />
      </li>
      <li>
        <Link href="/login?search=test" content="A" />
      </li>
      <li>
        <Link href="/b" content="B" />
      </li>
    </ul>
    <Router
      routes={{
        Home: () => <div>Hello</div>,
        Login: params => <Login search={params.search} />,
      }}
      routeCodec={routeCodec}
      defaultRoute={Routes.Home}
    />
  </div>
);
