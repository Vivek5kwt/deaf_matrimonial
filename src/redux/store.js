import { configureStore } from '@reduxjs/toolkit';
import profilesReducer from './profilesSlice';

export const store = configureStore({
  reducer: {
    profiles: profilesReducer,
  },
});

export default store;
