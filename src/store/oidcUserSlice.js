import { createSlice } from '@reduxjs/toolkit';

const oidcUserSlice = createSlice({
  name: 'oidcUser',
  initialState: { user: null },
  reducers: {
    setOidcUser: (state, { payload }) => { state.user = payload; },
  },
});

export const { setOidcUser } = oidcUserSlice.actions;
export default oidcUserSlice.reducer;
