import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TMenu } from '@interfaces/menu';

interface ISideNavState {
  selectedMenu: TMenu;
}

const initialState: ISideNavState = {
  selectedMenu: 'dashboard',
};

const sideNav = createSlice({
  name: 'sideNav',
  initialState,
  reducers: {
    selectMenu: (state, action: PayloadAction<TMenu>) => {
      state.selectedMenu = action.payload;
    },
  },
});

export const { selectMenu } = sideNav.actions;
export default sideNav.reducer;
