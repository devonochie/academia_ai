import { Box, Typography, List, ListItem, ListItemText, Button, Paper, Avatar, Chip, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';
import { getCurricula } from '../../features/curriculum/curriculumThunk';

const RecentCurricula = () => {
  const dispatch = useDispatch()
  const { generatedCurricula } = useSelector((state) => state.curriculum);
  const { isLoading } = useSelector((state) => state.curriculum);
  
  const curriculaArray = Array.isArray(generatedCurricula)
    ? generatedCurricula
    : [];
  
  React.useEffect(() => {
    dispatch(getCurricula())
  }, [dispatch])

  if (isLoading) {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Paper>
  );
}
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Your Recent Curricula</Typography>
        {curriculaArray.length > 0 && (
          <Chip label={`${curriculaArray.length} total`} size="small" />
        )}
      </Box>
      
      {curriculaArray.length === 0 ? (
        <Box textAlign="center" py={4}>
          <BookIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
          <Typography color="text.secondary">
            No curricula generated yet. Create one to get started!
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {curriculaArray.slice(0, 3).map((curriculum) => (
            <ListItem 
              key={curriculum._id} 
              button
             component={Link}
              to={`/curriculum/${curriculum._id}`}

              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                py: 2
              }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <BookIcon />
              </Avatar>
              <ListItemText
                primary={curriculum.metadata.topic}
                secondary={
                  <>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={curriculum.metadata.difficulty} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Box display="flex" alignItems="center" color="text.secondary">
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption" component="span">
                          {curriculum.metadata.total_estimated_hours} hrs
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      key={`modules-${curriculum.id}`}
                      variant="body2"
                      sx={{ mt: 0.5 }}
                      component="span"
                    >
                      {curriculum.modules.length} modules
                    </Typography>
                  </>
                }
                slotProps={{ secondary: { component: 'span' } }}
              />
            </ListItem>
          ))}
        </List>
      )}
      
      <Box mt={3}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/curriculum"
          fullWidth
          startIcon={<BookIcon />}
        >
          Generate New Curriculum
        </Button>
      </Box>
    </Paper>
  );
};

export default RecentCurricula;