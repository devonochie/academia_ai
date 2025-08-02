import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar,
  Button,
  Chip,
  Skeleton
} from '@mui/material';
import { getUserProgress } from '../../features/progress/progressThunk';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';


const ProgressTracker = () => {
  const dispatch = useDispatch();
  const { progressData, isLoading, error } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(getUserProgress());
  }, [dispatch]);

  console.log('Progress Data:', progressData);

  const calculateModuleProgress = (progress) => {
     console.log('Calculating progress for:', progress);
    if (!progress?.modules_progress?.length || !progress.curriculum_id?.modules) {
      console.log('Missing required data');
      return 0;
    }
    
    const totalLessons = progress.curriculum_id.modules.reduce(
      (sum, module) => sum + (module.lessons?.length || 0), 0
    );
    
    const completedLessons = progress.modules_progress.reduce(
      (sum, module) => sum + (module.completed_lessons?.length || 0), 0
    );

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const getProficiencyLabel = (progress) => {
  if (progress >= 85) return 'Expert';
  if (progress >= 60) return 'Advanced'; 
  if (progress >= 30) return 'Intermediate';
  return 'Beginner';
};
  const calculateOverallProgress = () => {
    if (!Array.isArray(progressData) || progressData.length === 0) return 0;
    
    const validProgresses = progressData.filter(p => p.curriculum_id);
    if (validProgresses.length === 0) return 0;
    
    const totalProgress = validProgresses.reduce((sum, curr) => {
      return sum + calculateModuleProgress(curr);
    }, 0);
    
    return Math.round(totalProgress / validProgresses.length);
  };

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading progress data
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => dispatch(getUserProgress())}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Skeleton width="60%" />
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" height={10} sx={{ mt: 1, borderRadius: 5 }} />
        </Box>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2, display: 'inline-block' }} />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="90%" />
          </Box>
        ))}
      </Paper>
    );
  }

  if (!Array.isArray(progressData) || progressData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <SchoolIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No progress data yet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Start a curriculum to track your learning progress
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/curriculum"
        >
          Browse Curricula
        </Button>
      </Paper>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Your Learning Progress
      </Typography>
      
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        backgroundColor: 'background.default', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">Proficiency Level</Typography>
          <Chip 
            label={getProficiencyLabel(overallProgress)} 
            color={
              overallProgress === 100 ? 'success' : 
              overallProgress > 50 ? 'primary' : 'default'
            }
            variant="outlined"
            size="small"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1">Overall Completion</Typography>
          <Chip 
            label={`${overallProgress}%`} 
            color={
              overallProgress === 100 ? 'success' : 
              overallProgress > 50 ? 'primary' : 'default'
            }
            variant="filled"
            size="small"
          />
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={overallProgress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              transition: 'width 0.5s ease'
            }
          }}
        />
      </Box>

      <List disablePadding>
        {progressData.map((progress, index) => {
          if (!progress.curriculum_id) return null;
          
          const curriculumProgress = calculateModuleProgress(progress);
          // Use populated current_module if available, fallback to first module
          const currentModule = progress.current_module && typeof progress.current_module === 'object'
            ? progress.current_module
            : progress.curriculum_id.modules?.[0];

          return (
            <ListItem 
              key={index} 
              component={Link} 
              to={`/curriculum/${progress.curriculum_id._id}`}
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                '&:hover': { 
                  backgroundColor: 'action.hover',
                  '& .MuiAvatar-root': {
                    transform: 'scale(1.1)',
                    boxShadow: 1
                  }
                },
                transition: 'all 0.3s ease',
                py: 2,
                px: 1,
                borderRadius: 1
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: curriculumProgress === 100 ? 'success.main' : 'primary.main', 
                  mr: 2,
                  transition: 'all 0.3s ease'
                }}
              >
                <SchoolIcon />
              </Avatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="medium"
                      noWrap
                    >
                      {progress.curriculum_id.metadata?.topic || 'Untitled Curriculum'}
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {progress.curriculum_id.modules.map(module => (
                          <Chip 
                            key={module.module_id || module._id} 
                            label={module.title} 
                            size="small" 
                            sx={{ fontSize: '0.75rem' }} 
                          />
                        ))}
                    </Box>
                  </Box>
                }
                secondary={
                  <>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <LinearProgress 
                        variant="determinate" 
                        value={curriculumProgress} 
                        sx={{ 
                          flexGrow: 1, 
                          height: 6,
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3
                          }
                        }}
                      />
                      <Typography variant="body2" component="span">
                        {curriculumProgress}%
                      </Typography>
                    </Box>
                    {currentModule && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon 
                          color={
                            curriculumProgress === 100 ? 'success' : 
                            curriculumProgress > 0 ? 'primary' : 'disabled'
                          } 
                          fontSize="small" 
                        />
                        <Typography variant="body2" component="span">
                          {curriculumProgress === 100
                            ? 'Completed'
                            : `Currently on: ${currentModule?.title || 'Unknown Module'}`}
                        </Typography>
                      </Box>
                    )}
                  </>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default ProgressTracker;