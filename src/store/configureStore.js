import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import questionsReducer from '../reducers/questions';
import busyIndicatorReducer from '../reducers/busyIndicator';
import notificationReducer from '../reducers/notification';
import userReducer from '../reducers/user';
import oidcUserReducer from './oidcUserSlice';

const middleware = getDefaultMiddleware =>
  process.env.NODE_ENV === 'development'
    ? getDefaultMiddleware({ serializableCheck: false }).concat(
        createLogger({ level: 'info', collapsed: true })
      )
    : getDefaultMiddleware({ serializableCheck: false });

export const store = configureStore({
  reducer: {
    user:          userReducer,
    busyIndicator: busyIndicatorReducer,
    notification:  notificationReducer,
    questions:     questionsReducer,
    oidcUser:      oidcUserReducer,
  },
  middleware,
});
