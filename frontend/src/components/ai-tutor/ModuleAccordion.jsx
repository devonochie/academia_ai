import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Box, 
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { updateProgress } from '../../features/progress/progressThunk';
import LessonItem from './LessonItem';
import { generateLessonContent } from '../../features/lesson/lessonThunk';

const ModuleAccordion = ({ module, curriculumId, progress }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(null);


  const moduleProgress = progress?.modules_progress?.find(
    mp => mp.module_id === module._id
  );
  
  const completedLessons = moduleProgress?.completed_lessons?.length || 0;
  const totalLessons = module.lessons.length;
  const completionPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const handleLessonComplete = (lessonId) => {
    dispatch(updateProgress({
      curriculumId,
      moduleId: module._id,
      lessonId,
      status: 'completed'
    }));
  };

  const handleLessonStart = async (lessonId) => {
   setLoadingLesson(lessonId);
  try {
    await dispatch(generateLessonContent({
      curriculumId,
      moduleId: module.module_id,
      lessonId,
      preferences: {}
    })).unwrap();
    dispatch(updateProgress({
      curriculumId,
      moduleId: module.module_id,
      lessonId,
      status: 'started'
    }));
    } finally {
    setLoadingLesson(null);
  }
};

  return (
    <Accordion 
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ 
        mb: 2,
        borderLeft: '4px solid',
        borderColor: completionPercentage === 100 ? 'success.main' : 
                    completionPercentage > 0 ? 'warning.main' : 'divider'
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{module.title}</Typography>
            <Chip 
              label={`${completedLessons}/${totalLessons} lessons`}
              color={completionPercentage === 100 ? 'success' : 'default'}
              variant={completionPercentage === 100 ? 'filled' : 'outlined'}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {module.description}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ mt: 2, height: 8, borderRadius: 4 }}
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Learning Outcomes:</Typography>
          <List dense>
            {module.lessons.reduce((outcomes, lesson) => {
              lesson.learning_outcomes.forEach(outcome => {
                if (!outcomes.includes(outcome)) outcomes.push(outcome);
              });
              return outcomes;
            }, []).map((outcome, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={outcome} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Lessons ({completedLessons}/{totalLessons} completed)
        </Typography>
        {module.lessons.map((lesson) => (
          <LessonItem
             key={lesson._id} 
              isLoading={loadingLesson === lesson.lesson_id}
             curriculumId={curriculumId}
             lesson={lesson} 
            isCompleted={moduleProgress?.completed_lessons?.includes(lesson.lesson_id)}
            onStart={() => handleLessonStart(lesson.lesson_id)}
            onComplete={() => handleLessonComplete(lesson._id)}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
};

export default ModuleAccordion;