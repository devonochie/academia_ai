import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Button, CircularProgress, Alert, List, ListItem, 
  ListItemText, Divider, TextField, Card, CardContent, Chip, Accordion,
  AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { generateRecommendations, getUserRecommendations } from '../../features/recommendation/recommendationThunk';
import { Link } from 'react-router-dom';

const RecommendationsPage = () => {
  const dispatch = useDispatch();
  const { recommendations, isLoading, error } = useSelector((state) => state.recommendation);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    dispatch(getUserRecommendations());
  }, [dispatch]);

  const handleGenerate = () => {
    if (message.trim().length < 10) {
      return; // Minimum message length
    }
    dispatch(generateRecommendations({ 
      conversationHistory: message.trim() 
    }));
    setMessage('');
  };

  // Create a helper function to safely display resources
const renderResource = (resource) => {
  if (!resource) return null;
  
  if (typeof resource === 'string') {
    return (
      <ListItem>
        <ListItemText primary={resource} />
      </ListItem>
    );
  }
  
  return (
    <ListItem 
      button
      component={Link}
      to={`/curriculum/${resource._id}`}
    >
      <ListItemText 
        primary={resource.metadata?.title || `Resource ${resource._id}`} 
        secondary={resource.metadata?.topic || ''}
      />
    </ListItem>
  );
};

// Then use it in your JSX:
{recommendations[0]?.compatibility?.matched_resources?.map(renderResource)}
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Your Personalized Learning Recommendations
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Based on your skill gaps and learning preferences
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Get New Recommendations</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Describe what you're trying to learn or any questions you have
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Example: I want to learn machine learning but I'm not sure where to start..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={isLoading || !message}
            size="large"
          >
            {isLoading ? 'Generating...' : 'Get Recommendations'}
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Your Recommendations</Typography>
          
         {recommendations.length === 0 || !recommendations[0]?.analysis ? (
            <Card variant="outlined">
              <CardContent>
                <Typography>No recommendations yet. Ask for some above!</Typography>
              </CardContent>
            </Card>
          ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Skill Analysis</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={`Proficiency: ${recommendations[0]?.analysis.current_proficiency_level || 'Not specified'}`}
                  color={
                    recommendations[0]?.analysis.current_proficiency_level === 'Expert' ? 'success' :
                    recommendations[0]?.analysis.current_proficiency_level === 'Advanced' ? 'info' :
                    recommendations[0]?.analysis.current_proficiency_level === 'Intermediate' ? 'primary' : 'default'
                  }
                  variant="outlined" 
                />
                <Chip 
                  label={`Learning Style: ${(recommendations[0]?.analysis.learning_style_preferences || []).join(', ')}`} 
                  variant="outlined" 
                />
              </Box>
              <Typography>
                Detected skill gaps: {(recommendations[0]?.analysis.detected_skill_gaps || []).join(', ')}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>Recommended Next Steps</Typography>
            
            <List sx={{ mb: 4 }}>
              {(recommendations[0]?.recommendations.immediate_next_steps || []).map((step, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight="bold">{step.topic}</Typography>
                      <Chip 
                        icon={<StarIcon />} 
                        label={`Priority: ${step.priority}`} 
                        color={step.priority === 'High' ? 'error' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <ScheduleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Estimated time: {step.estimated_time} hours
                    </Typography>
                    <Typography>{step.reason}</Typography>
                     {step.resource_model === 'LessonContent' && (
                        <Button 
                          variant="text" 
                          size="small"
                          component={Link}
                          to={`/lesson/${step.resource}`}
                          sx={{ mt: 1 }}
                        >
                          View Lesson Content
                        </Button>
                      )}
                      {step.resource_model === 'Curriculum' && (
                        <Button 
                          variant="text" 
                          size="small"
                          component={Link}
                          to={`/curriculum/${step.resource}`}
                          sx={{ mt: 1 }}
                        >
                          View Curriculum
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ))}
            </List>

            {recommendations[0]?.recommendations.longer_term_path && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Longer Term Learning Path</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle1" gutterBottom>
                    Skill Domain: {recommendations[0]?.recommendations.longer_term_path[0]?.skill_domain}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Related Topics:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(recommendations[0]?.recommendations.longer_term_path[0]?.related_topics || []).map((topic, i) => (
                      <Chip key={i} label={topic} variant="outlined" />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>Milestones:</Typography>
                  <List dense>
                    {(recommendations[0]?.recommendations.longer_term_path[0]?.milestones || []).map((milestone, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={milestone} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle2" gutterBottom>Matched Resources:</Typography>
                  <List dense>
                    {(recommendations[0]?.compatibility?.matched_resources || []).length === 0 ? (
                      <ListItem>
                        <ListItemText primary="No matched resources available." />
                      </ListItem>
                    ) : (
                      recommendations[0].compatibility.matched_resources.map((resource, i) => (
                        <ListItem 
                          key={i} 
                          button
                          component={Link}
                          to={`/curriculum/${resource._id}`}
                        >
                          <ListItemText 
                            primary={resource.metadata?.title || `Curriculum ${i+1}`} 
                            secondary={resource.metadata?.description || ''}
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                  <Typography variant="subtitle2" gutterBottom>Scheduled Availability:</Typography>
                  <Typography>
                    {recommendations[0]?.compatibility?.scheduled_availability || 'Not specified'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </>
        )}

        </>
      )}
    </Box>
  );
};

export default RecommendationsPage;