import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, TextField, Box, Typography, Container, Alert, 
  Select, MenuItem, FormControl, InputLabel, Card, CardContent,
  LinearProgress, Chip, CircularProgress
} from '@mui/material';
import { generateCurriculum } from '../../features/curriculum/curriculumThunk';
import { useNavigate } from 'react-router-dom';

const CurriculumCreation = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, currentCurriculum } = useSelector((state) => state.curriculum);

  const topicSuggestions = [
    "Machine Learning",
    "Data Science",
    "Web Development",
    "Artificial Intelligence"
  ];

 const handleGenerate = async (e) => {
  e.preventDefault();
  const sanitizedTopic = topic.trim().substring(0, 100); 
  if (!sanitizedTopic) return;
  
  try {
    const result = await dispatch(
      generateCurriculum({ 
        topic: sanitizedTopic, 
        difficulty
      })
    ).unwrap();
    
    if (result?.data?._id) {
      navigate(`/curriculum/${result.data._id}`);
    }
  } catch (err) {
    console.error("Generation failed:", err);
    // Error is already handled by the thunk
  }
};


  React.useEffect(() => {
    if (currentCurriculum?._id) {
      navigate(`/curriculum/${currentCurriculum._id}`);
    }
  }, [currentCurriculum, navigate]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Tutor - Generate Your Learning Path
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create a personalized curriculum tailored to your learning goals and skill level.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === 'string' ? error : 'Failed to generate curriculum'}
          </Alert>
        )}

        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Example Curriculum</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label="Machine Learning" color="primary" />
              <Chip label="Intermediate" variant="outlined" />
              <Chip label="240 hours" variant="outlined" />
            </Box>
            <Typography variant="body2">
              Practical applications and case studies of machine learning to help learners develop a deep understanding of the subject.
            </Typography>
          </CardContent>
        </Card>

        <Box component="form" onSubmit={handleGenerate} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="What do you want to learn?"
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 2 }}
            required
            inputProps={{ maxLength: 100 }}
          />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Popular topics:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {topicSuggestions.map((suggestion) => (
                <Chip 
                  key={suggestion}
                  label={suggestion}
                  onClick={() => setTopic(suggestion)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty Level"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="Novice">Novice (Just starting out)</MenuItem>
              <MenuItem value="Intermediate">Intermediate (Some experience)</MenuItem>
              <MenuItem value="Expert">Expert (Looking to master advanced topics)</MenuItem>
            </Select>
          </FormControl>

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2">Generating your curriculum...</Typography>
            </Box>
          ) : (
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!topic}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Generate Curriculum
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CurriculumCreation;
