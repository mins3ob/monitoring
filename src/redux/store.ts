import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@redux/slices/authSlice";
import sideNavReducer from "@redux/slices/sideNavSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    sideNav: sideNavReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
