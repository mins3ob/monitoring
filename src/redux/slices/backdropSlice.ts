import { createSlice } from '@reduxjs/toolkit';

interface IBackdropState {
  isVisible: boolean;
}

const initialState: IBackdropState = {
  isVisible: false,
};

const backdrop = createSlice({
  name: 'backdrop',
  initialState,
  reducers: {
    showBackdrop: state => {
      state.isVisible = true;
    },
    hideBackdrop: state => {
      state.isVisible = false;
    },
  },
});

export const { showBackdrop, hideBackdrop } = backdrop.actions;
export default backdrop.reducer;
