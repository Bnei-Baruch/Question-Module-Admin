import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './store/configureStore';
import Root from './containers/Root';
import { setDispatch, setGetState } from './utils/data';
import { connectSocket } from './utils/socket';

setDispatch(store.dispatch);
setGetState(store.getState);
connectSocket(store.dispatch, store.getState);

createRoot(document.getElementById('root')).render(<Root />);
