import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { serialUserId: new Date().getTime() },
  reducers: {},
});

export default userSlice.reducer;
