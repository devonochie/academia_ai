import PropTypes from 'prop-types';
import {
  Box, Typography, Card, CardContent,
  Chip, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText, Divider,
  Button, LinearProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ModuleAccordion from '../../components/ai-tutor/ModuleAccordion';

const ProgressIndicator = ({ progress }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography variant="body2" sx={{ mr: 1 }}>Progress:</Typography>
    <LinearProgress 
      variant="determinate" 
      value={progress} 
      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
    />
    <Typography variant="body2" sx={{ ml: 1 }}>{progress}%</Typography>
  </Box>
);

const CurriculumContent = ({ 
  curriculum, 
  onRecommendationsClick,
  progress = 0,
  modulesTitle = "Learning Modules",
  modulesSubtitle = "Complete the modules in order to master the topic",
}) => {
  if (!curriculum) {
    return <Typography>Curriculum data not available</Typography>;
  }

  const metadata = curriculum.metadata || {};
  const assessmentPlan = curriculum.assessment_plan || {};

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {metadata.topic || 'Untitled Curriculum'}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onRecommendationsClick}
        >
          Get Recommendations
        </Button>
      </Box>

      {/* Progress and Metadata */}
      <ProgressIndicator progress={progress} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip 
          label={`Difficulty: ${metadata.difficulty || 'Not specified'}`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`Estimated Time: ${metadata.total_estimated_hours || 'N/A'} hours`} 
          variant="outlined" 
        />
      </Box>

      {/* Overview Card */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Overview</Typography>
          <Typography paragraph>
            {curriculum.overview || 'No overview available.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Assessment Plan Accordion */}
      {assessmentPlan && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Assessment Plan</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {assessmentPlan.formative && (
              <>
                <Typography variant="subtitle1" gutterBottom>Formative Assessments:</Typography>
                <List dense>
                  {assessmentPlan.formative.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {assessmentPlan.summative && (
              <>
                <Typography variant="subtitle1" gutterBottom>Summative Assessments:</Typography>
                <List dense>
                  {assessmentPlan.summative.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Modules Section */}
      <Typography variant="h5" gutterBottom>{modulesTitle}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {modulesSubtitle}
      </Typography>

      

      <Box sx={{ mt: 2 }}>
        {curriculum.modules?.length > 0 ? (
          curriculum.modules.map((module) => (
            <ModuleAccordion 
              key={module._id} 
              module={module} 
              curriculumId={curriculum._id}
              progress={progress} 
            />
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No modules available in this curriculum yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

CurriculumContent.propTypes = {
  curriculum: PropTypes.shape({
    metadata: PropTypes.shape({
      topic: PropTypes.string,
      difficulty: PropTypes.string,
      total_estimated_hours: PropTypes.number
    }),
    overview: PropTypes.string,
    modules: PropTypes.array,
    assessment_plan: PropTypes.shape({
      formative: PropTypes.array,
      summative: PropTypes.array
    })
  }),
  progress: PropTypes.number,
  onRecommendationsClick: PropTypes.func.isRequired
};

export default CurriculumContent;