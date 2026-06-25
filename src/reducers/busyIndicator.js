import { createSlice } from '@reduxjs/toolkit';

const initialState = { progress: 0, step: 0, totalNeededProgress: 0, totalProgress: 0 };

const busyIndicatorSlice = createSlice({
  name: 'busyIndicator',
  initialState,
  reducers: {
    incrementBusyIndicator: state => { state.step += 1; },
    decrementBusyIndicator: state => {
      state.step = Math.max(0, state.step - 1);
      if (state.step === 0) state.progress = 0;
    },
    progressBusyIndicator: (state, { payload }) => { state.progress = parseInt(payload); },
    increaceBusyIndicatorTotalProgress: state => {
      state.totalNeededProgress += 1;
      state.progress = `${parseInt(((state.totalProgress + 1) / state.totalNeededProgress) * 100)}%`;
    },
    increaceBusyIndicatorProgress: state => {
      if (state.totalProgress + 1 === state.totalNeededProgress) return initialState;
      state.totalProgress += 1;
      state.progress = `${parseInt(((state.totalProgress) / state.totalNeededProgress) * 100)}%`;
    },
  },
});

export const {
  incrementBusyIndicator,
  decrementBusyIndicator,
  progressBusyIndicator,
  increaceBusyIndicatorTotalProgress,
  increaceBusyIndicatorProgress,
} = busyIndicatorSlice.actions;

export default busyIndicatorSlice.reducer;
