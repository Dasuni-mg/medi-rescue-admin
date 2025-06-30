import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// reducer import
// import customizationReducer from './customization-slice';

const reducer = combineReducers({
  // customization: customizationReducer
});

// const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
