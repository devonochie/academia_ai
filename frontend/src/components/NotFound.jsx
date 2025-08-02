import React from 'react';
import { 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Box, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="sm" sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Paper elevation={3} sx={{ 
        p: isMobile ? 3 : 4,
        width: '100%',
        textAlign: 'center',
        borderRadius: 4,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
      }}>
        <Box sx={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'error.light',
          color: 'error.contrastText',
          width: 80,
          height: 80,
          borderRadius: '50%',
          mb: 3
        }}>
          <ErrorOutlineIcon sx={{ fontSize: 48 }} />
        </Box>
        
        <Typography 
          variant={isMobile ? 'h3' : 'h2'} 
          color="text.primary" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(45deg, #f44336 30%, #ff5252 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography variant="h1" color="text.secondary" sx={{ fontWeight: 700, mb: 3 }}>
          404
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3,
            }
          }}
        >
          Return Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;