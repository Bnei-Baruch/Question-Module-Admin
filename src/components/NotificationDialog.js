import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { hideNotification } from '../reducers/notification';

export default function NotificationDialog() {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.notification);

  const handleClose = response => {
    notification.onClose && notification.onClose(response);
    dispatch(hideNotification(!!response));
  };

  return (
    <Dialog
      open={!!notification.show}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      {notification.title && (
        <DialogTitle id="alert-dialog-title">{notification.title}</DialogTitle>
      )}
      <DialogContent>
        {notification.text && (
          <DialogContentText id="alert-dialog-description">
            {notification.text}
          </DialogContentText>
        )}
        {notification.html && (
          <div dangerouslySetInnerHTML={{ __html: notification.html }} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)} color="primary">
          {notification.addNo ? 'YES' : 'OK'}
        </Button>
        {notification.addNo && (
          <Button onClick={() => handleClose(false)} color="primary">
            NO
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
