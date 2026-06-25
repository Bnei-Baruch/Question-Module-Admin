import { createSlice } from '@reduxjs/toolkit';

const initialState = { title: '', text: '', html: '', show: false, onClose: null, addNo: false };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, { payload }) => ({
      ...initialState,
      title:   payload.title   || '',
      text:    payload.text    || '',
      html:    payload.html    || '',
      onClose: payload.onClose || null,
      addNo:   payload.addNo   || false,
      show:    true,
    }),
    hideNotification: () => initialState,
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
