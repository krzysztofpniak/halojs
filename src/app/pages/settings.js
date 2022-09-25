import React from 'react';
import {connect, H, mkComponent, mkEval} from '../../halo/halo';
import Header from '../components/header';
import {Routes} from '../../data/routes';
import {mergeLeft} from 'ramda';
import Footer from '../../footer';
import daggy from 'daggy';
import Form from '../../halo/form';
import fieldTypes from '../form/fieldTypes';
import go from '../../halo/helpers/go';
import {A} from '../appM';
import {unit} from '../../halo/helpers/fns';

const Action = daggy.taggedSum('Action', {
  Initialize: [],
  Receive: ['input'],
  Form: ['formAction'],
});

const handleAction = action =>
  action.cata({
    Initialize: () =>
      go(function* () {
        const {currentUser} = yield H.get();
        return currentUser.cata({
          Nothing: () => H.of(unit),
          Just: user => H.query('Form')('form')(Form.Query.InitFields(user)),
        });
      }),
    Receive: input => H.modify(mergeLeft(input)),
    Form: input => input.cata({Submit: fields => A.putUser(fields)}),
  });

const schema = [
  {id: 'image'},
  {id: 'username'},
  {id: 'bio', type: 'textarea'},
  {id: 'email'},
];

const Settings = connect(s => s)(
  mkComponent({
    actionType: Action,
    initialState: ({currentUser}) => ({
      currentUser,
    }),
    evalFn: mkEval({
      initialize: Action.Initialize,
      handleAction,
    }),
  })(({currentUser, username, Slot}) => (
    <div>
      <Header currentUser={currentUser} route={Routes.Settings} />
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs12">
              <h1 className="text-xs-center">Your Settings</h1>
              <Slot
                component={Form}
                output={Action.Form}
                slotType="Form"
                slotId="form"
                schema={schema}
                fieldTypes={fieldTypes}
              />
              <hr />
              <button className="btn btn-outline-danger">Log out</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  ))
);

export default Settings;
