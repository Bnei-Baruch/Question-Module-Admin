import { combineReducers } from 'redux';
import user from './user';
import busyIndicator from './busyIndicator';
import notification from './notification';
import questions from './questions';
import { reducer as oidcReducer } from 'redux-oidc';

const rootReducer = combineReducers({
  user,
  busyIndicator,
  notification,
  oidc: oidcReducer,
  questions
});

export default rootReducer;
