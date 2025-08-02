import { Box, Typography, List, ListItem, ListItemText, Button, Paper, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { lightGreen, amber } from '@mui/material/colors';

const RecommendationsPreview = () => {
  const { recommendations } = useSelector((state) => state.recommendation);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Recommended Next Steps</Typography>
        <Button 
          component={Link} 
          to="/recommendations"
          size="small"
        >
          View All
        </Button>
      </Box>
      
      {recommendations.length === 0 ? (
        <Typography color="text.secondary">
          Complete your first lesson to get personalized recommendations
        </Typography>
      ) : (
        <List disablePadding>
          {recommendations[0]?.recommendations?.immediate_next_steps?.slice(0, 3).map((step, index) => (
            <ListItem 
              key={index}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <StarIcon sx={{ 
                      color: step.priority === 'High' ? lightGreen[500] : 
                             step.priority === 'Medium' ? amber[500] : 'text.secondary' 
                    }} />
                    <Typography fontWeight="medium">{step.topic}</Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2">{step.reason}</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Chip 
                        label={`Priority: ${step.priority}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: step.priority === 'High' ? lightGreen[100] : 
                                          step.priority === 'Medium' ? amber[100] : 'default',
                          color: 'text.primary'
                        }}
                      />
                      <Chip 
                        label={`${step.estimated_time} hrs`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecommendationsPreview;