import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import noteReducer from './notesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
  },
});

export default store;
