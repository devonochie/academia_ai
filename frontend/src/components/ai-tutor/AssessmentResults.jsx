import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Avatar,
  Stack,
  Container
} from '@mui/material';
import {
  CheckCircleOutline,
  HighlightOff,
  ArrowBack,
  EmojiEvents,
  Lightbulb,
  Group,
  Replay
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const getId = (_id) => (typeof _id === 'object' && _id.$oid ? _id.$oid : _id);

const AssessmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers = {}, assessment = {} } = location.state || {};
  const { curriculumId, lessonId } = useSelector((state) => state.lesson.currentLesson || {});

  if (!answers || Object.keys(answers).length === 0 || !assessment || Object.keys(assessment).length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          No results to display
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Please complete the assessment first to view your results
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const questions = assessment.knowledge_check.questions;
  const correctCount = questions.reduce((count, q) => {
    const qid = getId(q._id);
    const userAnswer = answers[qid];
    return userAnswer?.toLowerCase().trim() === q.model_answer.toLowerCase().trim() 
      ? count + 1 
      : count;
  }, 0);
  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Assessment Results
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Chip
          icon={<EmojiEvents fontSize="large" />}
          label={`${correctCount} / ${questions.length} (${scorePercentage}%)`}
          color={
            scorePercentage >= 80 ? 'success' :
            scorePercentage >= 50 ? 'warning' : 'error'
          }
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            py: 3,
            px: 4,
            mb: 3,
            '& .MuiChip-icon': { fontSize: '2rem' }
          }}
        />
      </Box>

      {/* Questions List */}
      <List sx={{ mb: 6 }}>
        {questions.map((q, idx) => {
          const qid = getId(q._id);
          const userAnswer = answers[qid];
          const isCorrect = userAnswer?.toLowerCase().trim() === q.model_answer.toLowerCase().trim();
          
          return (
            <Card
              key={qid}
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: 3,
                borderLeft: `6px solid ${isCorrect ? '#4caf50' : '#f44336'}`
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: isCorrect ? 'success.main' : 'error.main',
                    width: 48, 
                    height: 48 
                  }}>
                    {isCorrect ? (
                      <CheckCircleOutline fontSize="medium" />
                    ) : (
                      <HighlightOff fontSize="medium" />
                    )}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Question {idx + 1}
                  </Typography>
                  <Chip
                    label={isCorrect ? 'Correct' : 'Incorrect'}
                    color={isCorrect ? 'success' : 'error'}
                    sx={{ ml: 'auto', fontWeight: 600 }}
                  />
                </Stack>

                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                  {q.stem}
                </Typography>

                <Stack spacing={2} sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      YOUR ANSWER
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      bgcolor: 'action.hover', 
                      p: 1.5, 
                      borderRadius: 1,
                      borderLeft: '3px solid',
                      borderColor: isCorrect ? 'success.main' : 'error.main'
                    }}>
                      {userAnswer || <em style={{ color: 'text.disabled' }}>No answer provided</em>}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      CORRECT ANSWER
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      bgcolor: 'success.light', 
                      p: 1.5, 
                      borderRadius: 1 
                    }}>
                      {q.model_answer}
                    </Typography>
                  </Box>
                </Stack>

                {q.feedback && (
                  <Box sx={{
                    bgcolor: 'info.light',
                    p: 2,
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'info.main'
                  }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Lightbulb color="info" />
                      <Typography variant="subtitle2" color="text.secondary">
                        FEEDBACK
                      </Typography>
                    </Stack>
                    <Typography variant="body1">{q.feedback}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </List>

      {/* Action Section */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 3,
        boxShadow: 1,
        textAlign: 'center'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          What would you like to do next?
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            fullWidth
          >
            Review Lesson Material
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<Replay />}
            component={Link}
            to={`/curriculum/${getId(curriculumId)}/lesson/${getId(lessonId)}/practice`}
            state={{ curriculumId, lessonId }}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Practice Again
          </Button>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Group color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Need help? Ask your instructor or peers in the discussion forum
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AssessmentResults;