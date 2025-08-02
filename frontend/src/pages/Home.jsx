import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
} from '@mui/material';
import { 
  School as SchoolIcon, 
  AutoStories as LessonsIcon,
  Quiz as QuizIcon,
  TrendingUp as ProgressIcon 
} from '@mui/icons-material';
import ProgressTracker from '../components/ai-tutor/ProgressTracker';
import RecentCurricula from '../components/ai-tutor/RecentCurricula';
import { AuthContext } from '../firebase/context/AuthContext';
import Loader from '../components/Loader';

const Home = () => {
  const navigate = useNavigate();
  const { firebaseUser } = React.useContext(AuthContext)
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { curricula = [], isLoading: curriculaLoading } = useSelector((state) => state.curriculum);
  console.log(user)


  if (isLoading || (firebaseUser === undefined)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Loader />
      </Box>
    );
  }

  if (!isAuthenticated && !firebaseUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to AI Tutor
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Personalized learning powered by AI
        </Typography>
        <Box sx={{ '& > *': { m: 1 } }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5 }}
          >
            Sign In
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Create Account
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'Learner'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Continue your learning journey
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ height: '100%', cursor: 'pointer' }} 
                onClick={() => navigate('/curriculum')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Browse Curricula
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explore available learning paths
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ height: '100%', cursor: 'pointer' }}
                onClick={() => navigate('/lessons')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <LessonsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Your Lessons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Continue where you left off
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ height: '100%', cursor: 'pointer' }}
                onClick={() => navigate('/curriculum/:id/lesson/:lessonId/practice')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <QuizIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test your knowledge
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card 
                sx={{ height: '100%', cursor: 'pointer' }}
                onClick={() => navigate('/progress')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <ProgressIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Your Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your learning journey
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Progress Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <ProgressTracker />
            {Array.isArray(curricula) && curricula.length > 0 && !curriculaLoading && (
              <RecentCurricula sx={{ mt: 4 }} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;