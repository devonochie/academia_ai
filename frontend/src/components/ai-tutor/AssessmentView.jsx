import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { generateAssessment, submitAssessment, getAssessment } from '../../features/assessment/assessmentThunk';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  LinearProgress
} from '@mui/material';

const normalizeQuestion = (q, idx) => ({
  ...q,
  type: q.type || q.question_type,
  _id: q._id || q.question_id || idx,
  options: q.options
    ? q.options.map(opt => (typeof opt === 'string' ? opt : opt.text || opt))
    : undefined,
  stem: q.stem || q.question_text || q.text,
});

const AssessmentView = () => {
  const { id, curriculumId, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentAssessment, isLoading, error, submissionLoading, generating } = useSelector(
    (state) => state.assessment
  );
  const { currentLesson } = useSelector((state) => state.lesson);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getAssessment(id));
    } else if (curriculumId && lessonId) {
      if (currentLesson?.assessment) {
        setAnswers({});
        setCurrentQuestionIndex(0);
      } else {
        dispatch(generateAssessment({ curriculumId, lessonId }));
      }
    }
  }, [id, curriculumId, lessonId, currentLesson, dispatch]);

  // Normalize questions for frontend
  const rawAssessment = id ? currentAssessment : currentLesson?.assessment || currentAssessment;
  const assessmentData = rawAssessment
    ? {
        ...rawAssessment,
        questions: Array.isArray(rawAssessment.questions)
          ? rawAssessment.questions.map(normalizeQuestion)
          : [],
      }
    : null;

  const getQuestionId = (question, idx) => question?._id || question?.question_id || idx;

  const handleAnswerChange = (value) => {
    const question = assessmentData.questions[currentQuestionIndex];
    const questionId = getQuestionId(question, currentQuestionIndex);
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (id) {
      // Backend expects ordered array of answers for diagnostic assessments
      const responses = assessmentData.questions.map((q, idx) => {
        const qid = getQuestionId(q, idx);
        return answers[qid] || '';
      });
      dispatch(submitAssessment({
        assessmentId: id,
        responses,
      })).then(() => {
        navigate(`/assessments/${id}/results`);
      });
    } else if (curriculumId && lessonId) {
      navigate(`/lessons/${curriculumId}/${lessonId}/assessment/results`, {
        state: { answers }
      });
    }
  };

  if (isLoading || generating) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          {generating ? 'Generating assessment...' : 'Loading assessment...'}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mt: 1 }}
        >
          Go Back
        </Button>
      </Alert>
    );
  }

  if (!assessmentData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">No assessment found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!assessmentData.questions || !assessmentData.questions.length) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        This assessment contains no questions
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mt: 1 }}
        >
          Go Back
        </Button>
      </Alert>
    );
  }

  const currentQuestion = assessmentData.questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {assessmentData.title || 'Knowledge Check'}
        </Typography>
        {assessmentData.description && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {assessmentData.description}
          </Typography>
        )}

        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / assessmentData.questions.length) * 100} 
          sx={{ my: 3, height: 8 }}
        />

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestionIndex + 1} of {assessmentData.questions.length}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentQuestion.stem}
            </Typography>

            {currentQuestion.type === 'mcq' && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[getQuestionId(currentQuestion, currentQuestionIndex)] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'true_false' && (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[getQuestionId(currentQuestion, currentQuestionIndex)] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="True" />
                  <FormControlLabel value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'short_answer' && (
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={answers[getQuestionId(currentQuestion, currentQuestionIndex)] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Previous
              </Button>
              
              {currentQuestionIndex < assessmentData.questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={!answers[getQuestionId(currentQuestion, currentQuestionIndex)]}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={submissionLoading}
                >
                  {submissionLoading ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AssessmentView;