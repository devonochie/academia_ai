import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { logoutUser } from '../../features/auth/authThunk';
import { persistor } from '../../app/store';
import { AuthContext } from '../../firebase/context/AuthContext';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { firebaseUser, signOut } = React.useContext(AuthContext);

  const handleLogout = async () => {
     try {
        if (firebaseUser) await signOut();
        await dispatch(logoutUser()).unwrap();
        await persistor.purge();
        window.location.replace('/login');
      } catch (error) {
        console.error('Logout error:', error);
        window.location.replace('/login');
      }
  };


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Tutor
          </Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;