import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {createBrowserHistory} from 'history';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import {setDispatch, setGetState} from './utils/data';
import { connectSocket } from './utils/socket';

export const store = configureStore();

const history = createBrowserHistory();
connectSocket(store.dispatch, store.getState);
setDispatch(store.dispatch);
setGetState(store.getState);

const render = () => {
    ReactDOM.render(<AppContainer><Root store={store} history={history} /></AppContainer>, document.getElementById('root'));
}

// Render once
render();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render();
  });
}
