import React from 'react';
import Header from './app/components/header';
import Form from './halo/form';
import {connect, H, Link, mkComponent, mkEval} from './halo/halo';
import daggy from 'daggy';
import {A} from './app/appM';
import {done, manyRec, regex, runParserT, str} from './halo/helpers/parser';
import {always, fromPairs, mergeLeft, range} from 'ramda';
import go from './halo/helpers/go';
import {Routes, safeHref} from './data/routes';
import {Free} from './halo/helpers/free';
import {AppAction} from './app/reducer';
import fieldTypes from './app/form/fieldTypes';

const nameValue = go(function* () {
  const name = yield regex('\\w+');
  yield str('=');
  const value = yield regex('\\w+');
  return done([name, value]);
});

const queryStringParser = go(function* () {
  const x = yield nameValue;

  const xs = yield manyRec(
    go(function* () {
      yield str('&');
      return nameValue;
    })
  );

  return done(fromPairs([x, ...xs]));
});

console.log(
  'parseX',
  runParserT(queryStringParser)('page=33&a=54')[0]['@@show']()
);

const schema = [{id: 'email'}, {id: 'password', type: 'password'}];

const Action = daggy.taggedSum('Action', {
  Receive: ['input'],
  Form: ['formAction'],
});

const handleAction = action =>
  action.cata({
    Receive: input => H.modify(mergeLeft(input)),
    Form: formAction =>
      formAction.cata({
        Submit: fields =>
          go(function* () {
            const store = yield H.getStore();
            const a = yield A.authenticate(fields);
            yield a.cata({
              Nothing: () => A.notify('Złe hasło'),
              Just: user =>
                H.query('Form')('form')(Form.Query.Reset)
                  .chain(() =>
                    H.liftFuture(store.dispatch(AppAction.SetUser(user)))
                  )
                  .chain(() => A.navigate(Routes.Home)),
            });
            return Free.of('asd');
          }),
      }),
  });

const Login = connect(s => s)(
  mkComponent({
    initialState: always({}),
    actionType: Action,
    evalFn: mkEval({handleAction, receive: Action.Receive}),
  })(({Slot, currentUser}) => (
    <div className="auth-page">
      <Header currentUser={currentUser} route={Routes.Login} />
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link href={safeHref(Routes.Register)}>Need an account?</Link>
            </p>
            <Slot
              component={Form}
              output={Action.Form}
              slotType="Form"
              slotId="form"
              schema={schema}
              fieldTypes={fieldTypes}
            />
          </div>
        </div>
      </div>
    </div>
  ))
);

export default Login;
