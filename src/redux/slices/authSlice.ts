import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISignIn } from '@interfaces/auth';

interface IAuthState {
  isAuth: boolean;
  email: string | null;
  pw: string | null;
  profileImgUrl: string | null;
}

const initialState: IAuthState = {
  isAuth: false,
  email: null,
  pw: null,
  profileImgUrl: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: state => {
      Object.assign(state, initialState);
    },
    signIn: (state, action: PayloadAction<ISignIn>) => {
      state.isAuth = true;
      state.email = action.payload.email;
      state.pw = action.payload.pw;
    },
  },
});

export const { resetAuth, signIn } = auth.actions;
export default auth.reducer;
