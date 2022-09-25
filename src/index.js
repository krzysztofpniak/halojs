import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import Maybe from './halo/helpers/maybe';
import {fetchFuture} from './fetch';
import {prop} from 'ramda';
import {
  createHaloProvider,
  createNavigator,
  createStore,
  HaloProvider,
} from './halo/halo';
import {appReducer} from './app/reducer';
import Future from './halo/helpers/future';
import {AppF, interpretA} from './app/appM';
import {routeCodec} from './data/routes';
import go from './halo/helpers/go';

const readToken = Future.attempt(() =>
  localStorage.token ? Maybe.Just(localStorage.token) : Maybe.Nothing
);

const interpreters = [[AppF, interpretA({})]];

go(function* () {
  const token = yield readToken;

  const currentUser = yield token.cata({
    Just: token =>
      fetchFuture({
        url: 'https://api.realworld.io/api/user',
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .chain(r => Future.attemptP(() => r.json()))
        .map(prop('user'))
        .map(Maybe.Just),
    Nothing: () => Future.resolve(Maybe.Nothing),
  });

  const navigator = yield createNavigator;

  const store = yield createStore(appReducer, {currentUser});

  return Future.of({
    store,
    interpreters,
    routeCodec,
    navigator,
  });
}).fork(
  console.error,
  props =>
    console.log(props) ||
    ReactDOM.render(
      <React.StrictMode>
        <HaloProvider {...props}>
          <App />
        </HaloProvider>
      </React.StrictMode>,
      document.getElementById('root')
    )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
