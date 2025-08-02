import React from 'react';
import AppRoute from './AppRoutes';
import { Container, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const App = () => {
  return (
    <Container>
      <Typography variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HomeIcon sx={{ mr: 1 }} />
        Academia App
      </Typography>
      <AppRoute />
    </Container>
  );
};

export default App;