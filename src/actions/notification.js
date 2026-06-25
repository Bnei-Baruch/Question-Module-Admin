import { showNotification, hideNotification } from '../reducers/notification';

export { showNotification, hideNotification };

export function askNotification(cb, text) {
  return dispatch => {
    dispatch(showNotification({
      text: text || 'Are You Sure?',
      addNo: true,
      onClose: res => { res && cb(res); },
    }));
  };
}
