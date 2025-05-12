import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@redux/slices/authSlice';
import backdropReducer from '@redux/slices/backdropSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    backdrop: backdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
