import { 
  Box, 
  Typography, 
  Button, 
  Stack,
  Avatar,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import QuizIcon from '@mui/icons-material/Quiz';
import { Link } from 'react-router-dom';

const LessonItem = ({ curriculumId, lesson, isCompleted, onStart, onComplete }) => {
  return (
    <Box sx={{ 
      mb: 2,
      p: 2,
      borderRadius: 1,
      backgroundColor: isCompleted ? 'action.hover' : 'background.paper',
      borderLeft: '4px solid',
      borderColor: isCompleted ? 'success.main' : 'primary.main'
    }}>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: isCompleted ? 'success.main' : 'primary.main',
            width: 40, 
            height: 40 
          }}>
            {isCompleted ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <PlayCircleIcon fontSize="small" />
            )}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {lesson.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {lesson.duration_min} min • {lesson.learning_outcomes.length} outcomes
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={1} alignItems="center">
          {lesson.has_assessment && (
            <Tooltip title="Take assessment">
              <Button
                component={Link}
                to={`/lessons/${curriculumId}/${lesson.lesson_id}/assessment`}
                variant="outlined"
                size="small"
                startIcon={<QuizIcon />}
                sx={{ minWidth: 120 }}
              >
                Quiz
              </Button>
            </Tooltip>
          )}

          {!isCompleted ? (
            <>
              <Button
                component={Link}
                 disabled={!lesson.components?.length}
                to={`/lessons/${curriculumId}/${lesson.lesson_id}`}
                variant="outlined"
                size="small"
                startIcon={<PlayCircleIcon />}
                onClick={onStart}
                sx={{ minWidth: 100 }}
              >
                Start
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={onComplete}
                sx={{ minWidth: 100 }}
              >
                Complete
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to={`/lessons/${curriculumId}/${lesson.lesson_id}`}
              variant="text"
              size="small"
              onClick={onStart}
              startIcon={<PlayCircleIcon />}
              sx={{ minWidth: 100 }}
            >
              Review
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LessonItem;