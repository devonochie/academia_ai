import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  LinearProgress,
  Chip,
  Divider,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Fade,
  Grow,
  Zoom,
  Slide
} from '@mui/material';
import {
  CheckCircleOutline,
  HighlightOff,
  ArrowBack,
  ArrowForward,
  Send,
  EmojiEvents,
  Stars,
  AutoAwesome,
  Celebration,
  Lightbulb,
  Psychology
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import confetti from 'canvas-confetti';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { submitLessonAssessment } from '../../features/lesson/lessonThunk';

const getId = (_id) => (typeof _id === 'object' && _id.$oid ? _id.$oid : _id);

// Custom keyframe animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-30px);}
  60% {transform: translateY(-15px);}
`;

const celebrate = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
};

const LessonAssessment = ({ assessment , curriculumId, lessonId}) => {
   const navigate = useNavigate();
   const params = useParams()
   const moduleId = params.moduleId;
   const dispatch = useDispatch()
   const theme = useTheme();
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [answers, setAnswers] = useState({});
   const [showFeedback, setShowFeedback] = useState({});
   const [celebrated, setCelebrated] = useState(false);
   const [scoreStreak, setScoreStreak] = useState(0);

   const questions = assessment.knowledge_check.questions;
   const currentQuestion = questions[currentQuestionIndex];
   const qid = getId(currentQuestion._id);

   useEffect(() => {
      // Reset celebration when question changes
      setCelebrated(false);
   }, [currentQuestionIndex]);

   const handleAnswerChange = (questionId, value) => {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      if (currentQuestion.type !== 'short_answer') {
         setShowFeedback(prev => ({ ...prev, [questionId]: true }));
         checkForCelebration(value);
      }
   };

   const checkForCelebration = (value) => {
      const correct = value.toLowerCase().trim() === currentQuestion.model_answer.toLowerCase().trim();
      if (correct) {
         setScoreStreak(prev => prev + 1);
         if (scoreStreak > 0 && scoreStreak % 2 === 0) {
            celebrate();
            setCelebrated(true);
         }
      } else {
         setScoreStreak(0);
      }
   };

   const handleShortAnswerSubmit = () => {
      setShowFeedback(prev => ({ ...prev, [qid]: true }));
      checkForCelebration(answers[qid]);
   };

   const handleNext = () => {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handlePrev = () => {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleSubmit = async () => {
      try {
         celebrate();
         
         // Dispatch the submission and wait for it to complete
         const result = await dispatch(
            submitLessonAssessment({
            curriculumId: curriculumId,
            moduleId: moduleId,
            lessonId: lessonId,
            answers
            })
         ).unwrap(); 
         
         if (result.success) {
            navigate(`/lessons/assessment/results`, {
            state: { 
               answers, 
               assessment,
               score: result.data.score, 
               feedback: result.data.feedback, 
               weak_areas: result.data.weak_areas 
            }
            });
         } else {
            console.error('Submission failed:', result.message);
         }
      } catch (error) {
         console.error('Error submitting assessment:', error); 
      }
   };

   const isCorrect = () => {
      if (currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false') {
         return (
            answers[qid] &&
            answers[qid].toLowerCase().trim() === currentQuestion.model_answer.toLowerCase().trim()
         );
      }
      return null;
   };

   const getQuestionTypeLabel = () => {
      switch(currentQuestion.type) {
         case 'mcq': return 'Multiple Choice';
         case 'true_false': return 'True or False';
         case 'short_answer': return 'Short Answer';
         default: return 'Question';
      }
   };

   return (
      <Box sx={{ 
         maxWidth: 800, 
         mx: 'auto', 
         px: { xs: 2, sm: 3 }, 
         py: 3,
         position: 'relative'
      }}>
         {/* Floating decorative elements */}
         {celebrated && (
            <>
               <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  animation: `${float} 3s ease-in-out infinite`,
                  zIndex: 1
               }}>
                  <Tooltip title="Great job!">
                     <Stars color="primary" sx={{ fontSize: 60, opacity: 0.7 }} />
                  </Tooltip>
               </Box>
               <Box sx={{
                  position: 'absolute',
                  top: '20%',
                  left: 0,
                  animation: `${float} 3s ease-in-out infinite 0.5s`,
                  zIndex: 1
               }}>
                  <Tooltip title="You're on fire!">
                     <AutoAwesome color="secondary" sx={{ fontSize: 50, opacity: 0.7 }} />
                  </Tooltip>
               </Box>
            </>
         )}

         <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <Box sx={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center', 
               mb: 3 
            }}>
               <Typography variant="h4" component="h1" sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${pulse} 2s infinite`
               }}>
                  Knowledge Check
               </Typography>
               <Chip 
                  label={`${currentQuestionIndex + 1} of ${questions.length}`}
                  color="primary"
                  variant="outlined"
                  sx={{
                     fontWeight: 600,
                     fontSize: '1rem',
                     py: 1
                  }}
               />
            </Box>
         </Slide>

         <Grow in={true}>
            <LinearProgress
               variant="determinate"
               value={((currentQuestionIndex + 1) / questions.length) * 100}
               sx={{ 
                  height: 10, 
                  borderRadius: 4,
                  mb: 4,
                  '& .MuiLinearProgress-bar': {
                     borderRadius: 4,
                     background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                     transition: 'width 0.5s ease'
                  }
               }}
            />
         </Grow>

         <Box sx={{ animation: `${bounce} 1s` }}>
            <Grow in={true} timeout={500}>
               <Card 
                  variant="outlined" 
                  sx={{ 
                     borderRadius: 3,
                     boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                     mb: 4,
                     borderColor: 'divider',
                     background: 'rgba(255, 255, 255, 0.8)',
                     backdropFilter: 'blur(5px)',
                     position: 'relative',
                     overflow: 'visible',
                     '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        borderRadius: 'inherit',
                        background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                        zIndex: -1,
                        opacity: 0.3
                     }
                  }}
               >
                  <CardContent>
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                           label={getQuestionTypeLabel()} 
                           size="small" 
                           color="secondary"
                           variant="outlined"
                           sx={{ mr: 1, fontWeight: 600 }}
                           icon={<Lightbulb fontSize="small" />}
                        />
                        {showFeedback[qid] && (
                           <Zoom in={showFeedback[qid]}>
                              <Chip 
                                 label={isCorrect() ? 'Correct!' : 'Incorrect'} 
                                 size="small"
                                 color={isCorrect() ? 'success' : 'error'}
                                 icon={isCorrect() ? <CheckCircleOutline /> : <HighlightOff />}
                                 sx={{ 
                                    ml: 'auto',
                                    fontWeight: 600,
                                    transform: isCorrect() ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'transform 0.3s ease'
                                 }}
                              />
                           </Zoom>
                        )}
                     </Box>

                     <Typography variant="h6" component="h2" sx={{ 
                        fontWeight: 600, 
                        mb: 3,
                        fontSize: '1.25rem',
                        lineHeight: 1.4
                     }}>
                        {currentQuestion.stem}
                     </Typography>

                     {currentQuestion.type === 'mcq' && (
                        <List disablePadding>
                           {currentQuestion.options.map((option, i) => {
                              const selected = answers[qid] === option;
                              let bg = '';
                              let color = '';
                              if (showFeedback[qid]) {
                                 if (selected && isCorrect()) {
                                    bg = theme.palette.success.light;
                                    color = theme.palette.success.contrastText;
                                 } else if (selected && !isCorrect()) {
                                    bg = theme.palette.error.light;
                                    color = theme.palette.error.contrastText;
                                 } else if (option === currentQuestion.model_answer) {
                                    bg = theme.palette.success.light;
                                    color = theme.palette.success.contrastText;
                                 }
                              }
                              return (
                                 <Zoom in={true} key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                                    <ListItem
                                       button={!showFeedback[qid]}
                                       selected={selected}
                                       onClick={() => !showFeedback[qid] && handleAnswerChange(qid, option)}
                                       sx={{
                                          bgcolor: bg,
                                          color: color,
                                          borderRadius: 2,
                                          mb: 1,
                                          border: '1px solid',
                                          borderColor: selected ? 'primary.main' : 'divider',
                                          transition: 'all 0.3s ease',
                                          '&:hover': {
                                             borderColor: !showFeedback[qid] ? 'primary.main' : 'divider',
                                             transform: !showFeedback[qid] ? 'translateX(5px)' : 'none'
                                          }
                                       }}
                                    >
                                       <ListItemText 
                                          primary={option} 
                                          primaryTypographyProps={{ 
                                             fontWeight: selected ? 600 : 400,
                                             fontSize: '1rem'
                                          }}
                                       />
                                       {showFeedback[qid] && option === currentQuestion.model_answer && (
                                          <EmojiEvents sx={{ 
                                             ml: 1, 
                                             color: 'goldenrod',
                                             animation: `${pulse} 1.5s infinite`
                                          }} />
                                       )}
                                    </ListItem>
                                 </Zoom>
                              );
                           })}
                        </List>
                     )}

                     {currentQuestion.type === 'true_false' && (
                        <Box sx={{ 
                           display: 'flex', 
                           gap: 2, 
                           mb: 2,
                           justifyContent: 'center'
                        }}>
                           {['true', 'false'].map((val, i) => {
                              const selected = answers[qid] === val;
                              let bg = '';
                              if (showFeedback[qid]) {
                                 if (selected && isCorrect()) bg = 'success.main';
                                 else if (selected && !isCorrect()) bg = 'error.main';
                                 else if (val === currentQuestion.model_answer.toLowerCase()) bg = 'success.light';
                              }
                              return (
                                 <Grow in={true} key={val} timeout={i * 300}>
                                    <Button
                                       variant={selected ? 'contained' : 'outlined'}
                                       onClick={() => !showFeedback[qid] && handleAnswerChange(qid, val)}
                                       sx={{
                                          flex: 1,
                                          py: 2,
                                          bgcolor: bg,
                                          color: bg ? 'white' : undefined,
                                          fontWeight: 600,
                                          fontSize: '1.1rem',
                                          borderRadius: 2,
                                          textTransform: 'capitalize',
                                          transition: 'all 0.3s ease',
                                          '&:hover': !showFeedback[qid] && {
                                             transform: 'scale(1.05)',
                                             boxShadow: 2
                                          },
                                          '&.MuiButton-contained': {
                                             boxShadow: 'none'
                                          }
                                       }}
                                    >
                                       {val}
                                       {showFeedback[qid] && val === currentQuestion.model_answer.toLowerCase() && (
                                          <Celebration sx={{ 
                                             ml: 1,
                                             color: 'gold',
                                             animation: `${pulse} 1.5s infinite`
                                          }} />
                                       )}
                                    </Button>
                                 </Grow>
                              );
                           })}
                        </Box>
                     )}

                     {currentQuestion.type === 'short_answer' && (
                        <Zoom in={true}>
                           <Box>
                              <TextField
                                 fullWidth
                                 variant="outlined"
                                 placeholder="Type your brilliant answer here..."
                                 multiline
                                 rows={4}
                                 value={answers[qid] || ''}
                                 onChange={(e) => setAnswers(prev => ({ ...prev, [qid]: e.target.value }))}
                                 disabled={showFeedback[qid]}
                                 sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                       borderRadius: 2,
                                       transition: 'all 0.3s ease',
                                       '&:hover': {
                                          borderColor: 'primary.main',
                                          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                       }
                                    }
                                 }}
                              />
                              {!showFeedback[qid] && (
                                 <Button
                                    variant="contained"
                                    onClick={handleShortAnswerSubmit}
                                    disabled={!answers[qid] || answers[qid].trim() === ''}
                                    endIcon={<Send />}
                                    sx={{
                                       borderRadius: 2,
                                       px: 3,
                                       py: 1,
                                       fontWeight: 600,
                                       textTransform: 'none',
                                       transition: 'all 0.3s ease',
                                       '&:hover': {
                                          transform: 'translateY(-2px)',
                                          boxShadow: 3
                                       }
                                    }}
                                 >
                                    Submit Answer
                                 </Button>
                              )}
                           </Box>
                        </Zoom>
                     )}

                     {/* Feedback Section */}
                     <Fade in={showFeedback[qid]} timeout={500}>
                        <Box sx={{ 
                           mt: 3, 
                           p: 3, 
                           bgcolor: isCorrect() === true ? 'success.light' : 'error.light', 
                           borderRadius: 2,
                           borderLeft: `6px solid ${isCorrect() === true ? theme.palette.success.main : theme.palette.error.main}`,
                           boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                           transform: isCorrect() ? 'scale(1.02)' : 'scale(1)',
                           transition: 'transform 0.3s ease'
                        }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {isCorrect() === true ? (
                                 <CheckCircleOutline color="success" sx={{ 
                                    mr: 1, 
                                    fontSize: '2rem',
                                    animation: `${pulse} 2s infinite`
                                 }} />
                              ) : (
                                 <HighlightOff color="error" sx={{ 
                                    mr: 1, 
                                    fontSize: '2rem',
                                    animation: `${pulse} 1s infinite`
                                 }} />
                              )}
                              <Typography variant="subtitle1" fontWeight="bold" color={isCorrect() === true ? 'success.dark' : 'error.dark'}>
                                 {isCorrect() === true
                                    ? 'Brilliant! You nailed it!'
                                    : 'Almost there! Keep trying!'}
                              </Typography>
                           </Box>
                           <Divider sx={{ 
                              my: 2, 
                              borderColor: isCorrect() === true ? 'success.main' : 'error.main', 
                              opacity: 0.5 
                           }} />
                           <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight="medium" gutterBottom>
                                 <Psychology color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                 Model Answer:
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                 bgcolor: 'background.paper', 
                                 p: 2, 
                                 borderRadius: 1,
                                 borderLeft: `4px solid ${theme.palette.primary.main}`,
                                 boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                              }}>
                                 {currentQuestion.model_answer}
                              </Typography>
                           </Box>
                           <Box>
                              <Typography variant="body2" fontWeight="medium" gutterBottom>
                                 <Lightbulb color="secondary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                 Explanation:
                              </Typography>
                              <Typography variant="body1">
                                 {currentQuestion.feedback}
                              </Typography>
                           </Box>
                        </Box>
                     </Fade>

                     <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mt: 4,
                        pt: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                     }}>
                        <Button
                           variant="outlined"
                           disabled={currentQuestionIndex === 0}
                           onClick={handlePrev}
                           startIcon={<ArrowBack />}
                           sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              fontWeight: 600,
                              textTransform: 'none',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                 transform: 'translateX(-3px)'
                              }
                           }}
                        >
                           Previous
                        </Button>

                        {currentQuestionIndex < questions.length - 1 ? (
                           <Button
                              variant="contained"
                              onClick={handleNext}
                              disabled={!showFeedback[qid]}
                              endIcon={<ArrowForward />}
                              sx={{
                                 borderRadius: 2,
                                 px: 3,
                                 py: 1,
                                 fontWeight: 600,
                                 textTransform: 'none',
                                 transition: 'all 0.3s ease',
                                 '&:hover': {
                                    transform: 'translateX(3px)',
                                    boxShadow: 3
                                 },
                                 '&:disabled': {
                                    transform: 'none'
                                 }
                              }}
                           >
                              Next Question
                           </Button>
                        ) : (
                           <Zoom in={showFeedback[qid]} style={{ transitionDelay: '300ms' }}>
                              <Button
                                 variant="contained"
                                 color="success"
                                 onClick={handleSubmit}
                                 endIcon={<EmojiEvents />}
                                 sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                       transform: 'scale(1.05)',
                                       boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                                    }
                                 }}
                              >
                                 Complete Assessment
                              </Button>
                           </Zoom>
                        )}
                     </Box>
                  </CardContent>
               </Card>
            </Grow>
         </Box>

         {/* Streak indicator */}
         {scoreStreak > 1 && (
            <Fade in={scoreStreak > 1}>
               <Box sx={{
                  position: 'fixed',
                  bottom: 20,
                  right: 20,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 1,
                  boxShadow: 3,
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 1000
               }}>
                  <Avatar sx={{ 
                     bgcolor: 'secondary.main', 
                     width: 32, 
                     height: 32,
                     mr: 1,
                     animation: `${pulse} 1s infinite`
                  }}>
                     {scoreStreak}
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                     Correct streak!
                  </Typography>
               </Box>
            </Fade>
         )}
      </Box>
   );
};

export default LessonAssessment;