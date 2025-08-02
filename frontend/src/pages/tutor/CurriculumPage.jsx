import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Alert, Skeleton, Button, Divider, Typography } from '@mui/material';
import { getCurriculum } from '../../features/curriculum/curriculumThunk';

import CurriculumContent from './CurriculumContent';


const CurriculumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCurriculum, isLoading, error } = useSelector(
    (state) => state.curriculum
  );
  const { currentProgress = 0 } = useSelector((state) => state.progress);


 React.useEffect(() => {
  if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
    dispatch(getCurriculum(id));
  } else {
    navigate('/not-found', { replace: true });
  }
}, [id, dispatch, navigate]);

  const handleRecommendationsClick = () => {
    navigate('/recommendations');
  };

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton variant="text" width="60%" height={70} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={200} height={32} />
          <Skeleton variant="rectangular" width={200} height={32} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={150} sx={{ mb: 4 }} />
        <Skeleton variant="text" width="40%" height={50} />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" width="100%" height={80} sx={{ my: 2 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error.message || error.toString()}
        <Button onClick={() => navigate('/')} sx={{ ml: 2 }}>
          Go Home
        </Button>
      </Alert>
    );
  }

  if (!currentCurriculum) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Curriculum not found
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The requested curriculum could not be loaded.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <>
      <CurriculumContent 
        curriculum={currentCurriculum} 
        onRecommendationsClick={handleRecommendationsClick}
        progress={currentProgress}
      />
      
      <Divider sx={{ my: 4 }} />
    </>
  );
};

export default CurriculumPage;