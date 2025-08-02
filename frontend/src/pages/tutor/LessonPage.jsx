import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, CircularProgress, Typography, Alert, Card, CardContent, 
  Button, Divider, Chip, List, ListItem, ListItemText, 
  Tab, Tabs, Avatar, Tooltip, Fade, Grow, Zoom, Slide
} from '@mui/material';
import { 
  School as SchoolIcon,
  Code as CodeIcon,
  Quiz as QuizIcon,
  ArrowBack,
  MenuBook,
  Lightbulb,
  Error,
  Timer,
  Checklist,
  Link,
  Psychology
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { getLessonContent } from '../../features/lesson/lessonThunk';
import LessonAssessment from '../../components/ai-tutor/LessonAssessment';

// Custom animations

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LessonPage = () => {
  const params = useParams();
  const curriculumId = params.curriculumId || params.id || params.curriculum_id;
  const lessonId = params.lessonId || params.lesson_id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLesson, isLoading, error } = useSelector((state) => state.lesson);
  const { currentCurriculum } = useSelector((state) => state.curriculum)
  const [activeTab, setActiveTab] = React.useState(0);
  const [tabLoading, setTabLoading] = React.useState(false);
  
console.log(currentLesson, 'Current Lesson Data');
  React.useEffect(() => {
    if (curriculumId && lessonId) {
      dispatch(getLessonContent({ curriculumId, lessonId }));
    }
  }, [curriculumId, lessonId, dispatch]);

  const getLessonDurationsAndOutcomes = () => {
    if (!currentCurriculum?.modules) return [];
    return currentCurriculum.modules.flatMap(module =>
      (module.lessons || []).map(lesson => ({
        lesson_id: lesson.lesson_id,
        title: lesson.title,
        duration_min: lesson.duration_min,
        learning_outcomes: lesson.learning_outcomes
      }))
    );
  };

  const curriculumData = getLessonDurationsAndOutcomes()
  
  const handleTabChange = async (event, newValue) => {
  
    setTabLoading(true);
    setActiveTab(newValue);
    await new Promise(resolve => setTimeout(resolve, 300));
    setTabLoading(false);
  };

  // Improved content parsing
const theoreticalContent = currentLesson?.core_content?.theoretical_foundation?.detailed_explanation || '';
const theoreticalSections = typeof theoreticalContent === 'string' 
  ? theoreticalContent.split('\n\n').filter(section => section.trim())
  : [];

// Better case study processing
const processCaseStudySolution = (solution) => {
  if (!solution) return [];
  if (typeof solution === 'string') {
    return solution.split('\n').map((step, i) => ({
      step: step.startsWith('Step') ? step : `Step ${i + 1}: ${step}`,
      description: step
    }));
  }
  return Array.isArray(solution) ? solution : [];
};

  // Find the current lesson's duration and learning outcomes count
  const lessonMeta = curriculumData?.find(l => l.lesson_id === currentLesson?.lesson_id);
  const durationEstimate = currentLesson?.duration_estimate 

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Slide direction="down" in={true}>
        <Alert severity="error" sx={{ m: 2 }}>
          <Box display="flex" alignItems="center">
            <Error sx={{ mr: 1 }} />
            <Typography variant="body1">
              Error loading lesson: {error.message || error}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Back to Safety
          </Button>
        </Alert>
      </Slide>
    );
  }

  if (!currentLesson) {
    return (
      <Fade in={true}>
        <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Lesson not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Back to Curriculum
          </Button>
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', position: 'relative', zIndex: 1 }}>
      <Slide direction="down" in={true}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${pulse} 3s infinite`
          }}>
            {currentLesson.title}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600
            }}
          >
            Back
          </Button>
        </Box>
      </Slide>

      <Grow in={true}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <Tooltip title="Estimated time to complete">
            <Chip 
              icon={<Timer />}
              label={`${durationEstimate|| 0} min`} 
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                px: 1
              }}
            />
          </Tooltip>
          <Tooltip title="Learning outcomes">
            <Chip 
              icon={<Checklist />}
              label={`${lessonMeta?.learning_outcomes?.length || 0} outcomes`} 
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                px: 1
              }}
            />
 
            {lessonMeta?.learning_outcomes?.length > 0 && (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
      Learning Outcomes
    </Typography>
    <List dense>
      {lessonMeta.learning_outcomes.map((outcome, idx) => (
        <ListItem key={idx} sx={{ pl: 0 }}>
          <ListItemText 
            primary={`• ${outcome}`} 
            primaryTypographyProps={{ fontSize: '1rem' }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
)}

          </Tooltip>
        </Box>
      </Grow>

      <Zoom in={true}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0'
            }
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<SchoolIcon />} 
            label="Theory" 
            iconPosition="start"
            sx={{ 
              minHeight: 48,
              fontWeight: 600,
              '&:hover': {
                color: 'primary.main'
              }
            }}
          />
          <Tab 
            icon={<CodeIcon />} 
            label="Practice" 
            iconPosition="start"
            sx={{ 
              minHeight: 48,
              fontWeight: 600,
              '&:hover': {
                color: 'secondary.main'
              }
            }}
          />
          {currentLesson.assessment && (
            <Tab 
              icon={<QuizIcon />} 
              label="Assessment" 
              iconPosition="start"
              sx={{ 
                minHeight: 48,
                fontWeight: 600,
                '&:hover': {
                  color: 'success.main'
                }
              }}
            />
          )}
          <Tab 
            icon={<MenuBook />} 
            label="Resources" 
            iconPosition="start"
            sx={{ 
              minHeight: 48,
              fontWeight: 600,
              '&:hover': {
                color: 'info.main'
              }
            }}
          />
        </Tabs>
      </Zoom>

      {tabLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <Fade in={!tabLoading} timeout={500}>
          <Box>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SchoolIcon color="primary" />
                  Theoretical Foundation
                </Typography>
                
                <Grow in={true}>
                  <Card variant="outlined" sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 600,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Lightbulb color="secondary" />
                        Key Concepts
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1, 
                        my: 2 
                      }}>
                        {currentLesson.core_content?.theoretical_foundation?.key_concepts?.map((concept, index) => (
                          <Zoom 
                            key={index} 
                            in={true} 
                            style={{ transitionDelay: `${index * 100}ms` }}
                          >
                            <Chip 
                              label={concept} 
                              color="primary" 
                              variant="outlined"
                              sx={{
                                fontWeight: 500,
                                px: 1
                              }}
                            />
                          </Zoom>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>

                {theoreticalSections.map((section, index) => (
                  <Slide 
                    key={index} 
                    direction="up" 
                    in={true}
                    timeout={(index + 1) * 200}
                  >
                    <Card variant="outlined" sx={{ 
                      mb: 2,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      }
                    }}>
                      <CardContent>
                        <Typography whiteSpace="pre-wrap" sx={{ fontSize: '1.1rem' }}>
                          {section}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}

                {currentLesson.core_content?.theoretical_foundation?.formulas && (
                  <Grow in={true}>
                    <Box component="pre" sx={{ 
                      p: 3, 
                      backgroundColor: 'rgba(25, 118, 210, 0.05)', 
                      borderRadius: 3,
                      overflowX: 'auto',
                      border: '1px solid rgba(25, 118, 210, 0.2)',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      mt: 3
                    }}>
                      {currentLesson.core_content.theoretical_foundation.formulas.join('\n')}
                    </Box>
                  </Grow>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CodeIcon color="secondary" />
                  Applied Learning
                </Typography>
                {currentLesson.core_content?.applied_learning?.case_studies?.map((caseStudy, index) => {
                  const solutionSteps = processCaseStudySolution(caseStudy.solution);
                  return (
                    <Zoom 
                      key={index} 
                      in={true}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Card variant="outlined" sx={{ 
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                        }
                      }}>
                        <CardContent>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            {caseStudy.title}
                          </Typography>
                          <Typography paragraph sx={{ fontSize: '1.1rem' }}>
                            <strong>Problem:</strong> {caseStudy.problem}
                          </Typography>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600,
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Psychology color="primary" />
                            Solution Approach
                          </Typography>
                          
                          {solutionSteps.map(({ step, description }, i) => (
                            <Box key={i} sx={{ 
                              mb: 2,
                              pl: 2,
                              borderLeft: '3px solid',
                              borderColor: 'primary.main'
                            }}>
                              <Typography fontWeight="bold" color="primary">
                                {step.split(':')[0]}:
                              </Typography>
                              <Typography sx={{ ml: 1 }}>
                                {step.split(':')[1] || description}
                              </Typography>
                            </Box>
                          ))}
                          
                          {caseStudy.key_takeaways?.length > 0 && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <Lightbulb color="secondary" />
                                Key Takeaways
                              </Typography>
                              <List dense>
                                {caseStudy.key_takeaways.map((takeaway, i) => (
                                  <Zoom 
                                    key={i} 
                                    in={true}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                  >
                                    <ListItem sx={{ 
                                      alignItems: 'flex-start',
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                      }
                                    }}>
                                      <Avatar sx={{ 
                                        width: 24, 
                                        height: 24, 
                                        mr: 2,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.8rem'
                                      }}>
                                        {i + 1}
                                      </Avatar>
                                      <ListItemText 
                                        primary={takeaway} 
                                        primaryTypographyProps={{ 
                                          fontWeight: 500,
                                          fontSize: '1rem'
                                        }}
                                      />
                                    </ListItem>
                                  </Zoom>
                                ))}
                              </List>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Zoom>
                  );
                })}
              </Box>
            )}

            {activeTab === 2 && currentLesson.assessment && (
              <LessonAssessment
                assessment={currentLesson.assessment}
                curriculumId={curriculumId}
                lessonId={lessonId}
              />
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <MenuBook color="info" />
                  Supplemental Resources
                </Typography>
                
                {currentLesson.supplemental && (
                  <>
                    <Slide direction="right" in={true}>
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Link color="primary" />
                          Further Reading
                        </Typography>
                        <List sx={{ 
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          p: 1
                        }}>
                          {Array.isArray(currentLesson.supplemental.further_reading) && 
                            currentLesson.supplemental.further_reading.map((item, index) => (
                              <Zoom 
                                key={index} 
                                in={true}
                                style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                <ListItem 
                                  button 
                                  component="a" 
                                  href={item.url} 
                                  target="_blank"
                                  sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateX(5px)',
                                      bgcolor: 'rgba(25, 118, 210, 0.05)'
                                    }
                                  }}
                                >
                                  <ListItemText 
                                    primary={typeof item === 'string' ? item : item.title} 
                                    secondary={typeof item === 'string' ? '' : item.source} 
                                    primaryTypographyProps={{ 
                                      fontWeight: 500,
                                      color: 'primary.main'
                                    }}
                                    secondaryTypographyProps={{ 
                                      color: 'text.secondary'
                                    }}
                                  />
                                </ListItem>
                              </Zoom>
                            ))}
                        </List>
                      </Box>
                    </Slide>
                    
                    <Slide direction="left" in={true}>
                      <Box>
                        <Typography variant="h5" gutterBottom sx={{ 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Error color="error" />
                          Common Misconceptions
                        </Typography>
                        <List sx={{ 
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          p: 1
                        }}>
                          {Array.isArray(currentLesson.supplemental.common_misconceptions) && 
                            currentLesson.supplemental.common_misconceptions.map((item, index) => (
                              <Zoom 
                                key={index} 
                                in={true}
                                style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                <ListItem sx={{ 
                                  alignItems: 'flex-start',
                                  borderRadius: 2,
                                  mb: 1,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateX(5px)',
                                    bgcolor: 'rgba(244, 67, 54, 0.05)'
                                  }
                                }}>
                                  <Avatar sx={{ 
                                    width: 24, 
                                    height: 24, 
                                    mr: 2,
                                    bgcolor: 'error.main',
                                    fontSize: '0.8rem'
                                  }}>
                                    !
                                  </Avatar>
                                  <ListItemText 
                                    primary={typeof item === 'string' ? item : item.explanation} 
                                    primaryTypographyProps={{ 
                                      fontWeight: 500,
                                      color: 'error.main'
                                    }}
                                  />
                                </ListItem>
                              </Zoom>
                            ))}
                        </List>
                      </Box>
                    </Slide>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Fade>
      )}
      {/* <Box sx={{ position: 'relative', zIndex: 2 }}>
        <ChatBot current_topic={currentLesson.lesson_topic} />
      </Box> */}
    </Box> 
  );
};

export default LessonPage;