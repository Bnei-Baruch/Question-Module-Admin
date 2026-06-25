import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SideMenu from './SideMenu';
import { askNotification } from 'actions/notification';
import { clearAll } from 'actions/questions';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.oidcUser.user);
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => setOpenMenu(v => !v);

  const handleClearAll = () => {
    dispatch(askNotification(() => {
      dispatch(clearAll());
    }));
  };

  return (
    <AppBar position="static" sx={{ mb: 1 }}>
      <Toolbar sx={{ background: '#bbb' }}>
        {user && (
          <>
            <IconButton color="inherit" aria-label="Menu" onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Galaxy Question Admin
            </Typography>
            <SideMenu open={openMenu} toggle={toggleMenu} />
            <Button onClick={handleClearAll} sx={{ position: 'absolute', right: 10 }}>
              CLEAR ALL
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
