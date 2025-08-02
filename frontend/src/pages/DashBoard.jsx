import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../firebase/context/AuthContext';
import { logoutUser } from '../features/auth/authThunk';
import { persistor } from '../app/store';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Box,
  Grid,
  Divider,
  Container,
  Paper,
  Chip,
  Badge
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  ErrorOutline as ErrorOutlineIcon,
  AccountCircle as AccountCircleIcon,
  School as SchoolIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bookmarks as BookmarksIcon
} from '@mui/icons-material';
import ProgressTracker from '../components/ai-tutor/ProgressTracker';
import RecentCurricula from '../components/ai-tutor/RecentCurricula';
import RecommendationsPreview from '../components/ai-tutor/RecommendationsPreview';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const { firebaseUser, signOut } = React.useContext(AuthContext);
  const { recommendations } = useSelector((state) => state.recommendation);

  const handleLogout = async () => {
    try {
      if (firebaseUser) await signOut();
      await dispatch(logoutUser()).unwrap();
      await persistor.purge();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const getUserData = () => {
    try {
      if (firebaseUser) {
        return {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || null,
          role: 'Firebase User',
          lastLogin: new Date().toISOString(),
        };
      } else if (user) {
        return {
          name: user.name || 'User',
          email: user.email || '',
          photoURL: user.photoURL || null,
          role: user.role || 'User',
          lastLogin: user.lastLogin || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error('Error retrieving user data:', err);
    }
    return null;
  };

  const displayUser = getUserData();

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={3} fontWeight={600}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  if (!displayUser) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="large" />}
          sx={{
            width: '100%',
            maxWidth: 500,
            fontSize: '1.1rem',
            '& .MuiAlert-message': { py: 1.5 },
          }}
        >
          No user is authenticated. Please <a href="/login">log in</a>.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* User Profile Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={3} alignItems="center" p={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'success.main',
                          border: '2px solid white',
                        }}
                      >
                        <AutoAwesomeIcon fontSize="small" />
                      </Avatar>
                    }
                  >
                    <Avatar
                      src={displayUser.photoURL}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.light',
                        fontSize: 50,
                        boxShadow: 3,
                      }}
                    >
                      {!displayUser.photoURL && (
                        <AccountCircleIcon fontSize="inherit" />
                      )}
                    </Avatar>
                  </Badge>

                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight={700}
                    align="center"
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Welcome, {displayUser.name}
                  </Typography>

                  <Box width="100%">
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                      }}
                    >
                      <Stack spacing={1}>
                        <Typography variant="body1">
                          <strong>Email:</strong> {displayUser.email}
                        </Typography>
                        {displayUser.role && (
                          <Typography variant="body1">
                            <strong>Role:</strong> {displayUser.role}
                          </Typography>
                        )}
                        {displayUser.lastLogin && (
                          <Typography variant="body1">
                            <strong>Last login:</strong>{' '}
                            {new Date(displayUser.lastLogin).toLocaleString()}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Box>

                  {error && (
                    <Alert
                      severity="error"
                      icon={<ErrorOutlineIcon />}
                      sx={{ width: '100%' }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    width="100%"
                  >
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      disabled={isLoading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Signing out...
                        </>
                      ) : (
                        'Sign Out'
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<PersonIcon />}
                      onClick={() => navigate('/profile')}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Profile
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Dashboard */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: 3,
                minHeight: '100%',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={4}>
                <SchoolIcon fontSize="large" color="primary" />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Learning Dashboard
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {/* Progress Tracker */}
                <Grid item xs={12} lg={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <BookmarksIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      Your Progress
                    </Typography>
                  </Box>
                  <ProgressTracker />
                </Grid>

                {/* Recent Curricula */}
                <Grid item xs={12} lg={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      Recent Learning Paths
                    </Typography>
                  </Box>
                  <RecentCurricula />
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      Personalized Recommendations
                    </Typography>
                    {recommendations.length > 0 && (
                      <Chip 
                        label="New" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <RecommendationsPreview />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;