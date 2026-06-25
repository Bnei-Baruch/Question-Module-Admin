import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

export default function SideMenu({ open, toggle }) {
  const navigate = useNavigate();
  const { removeUser } = useAuth();

  const route = to => {
    navigate(`/${to}`);
  };

  const logout = () => {
    removeUser();
    setTimeout(() => window.location.reload(true), 1000);
  };

  return (
    <Drawer open={open} onClose={toggle}>
      <div tabIndex={0} role="button" onClick={toggle} onKeyDown={toggle}>
        <div style={{ width: 250 }}>
          <List style={{ padding: 15, cursor: 'pointer', display: 'flex' }} onClick={() => route('orginaizer')}>
            Organizer Admin
          </List>
          <Divider />
          <List style={{ padding: 15, cursor: 'pointer', display: 'flex' }} onClick={() => route('speaker')}>
            Speaker Admin
          </List>
          <List style={{ padding: 15, cursor: 'pointer', display: 'flex' }} onClick={() => route('tags')}>
            Admin Tags
          </List>
          {/* <List style={{ padding: 15, cursor: 'pointer', display: 'flex' }} onClick={() => route('rav')}>
            Rav View
          </List> */}
          <Divider />
          <List style={{ padding: 15, cursor: 'pointer', display: 'flex' }} onClick={logout}>
            Logout
          </List>
        </div>
      </div>
    </Drawer>
  );
}
