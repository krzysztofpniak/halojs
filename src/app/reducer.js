import daggy from 'daggy';
import {assoc} from 'ramda';
import Maybe from '../halo/helpers/maybe';

const AppAction = daggy.taggedSum('AppAction', {SetUser: ['user']});

const appReducer = (action, state) =>
  action.cata({
    SetUser: user => assoc('currentUser', Maybe.Just(user), state),
  });

export {appReducer, AppAction};
