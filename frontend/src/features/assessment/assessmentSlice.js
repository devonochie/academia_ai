import { createSlice } from '@reduxjs/toolkit';
import { generateAssessment, submitAssessment } from './assessmentThunk';

const initialState = {
  currentAssessment: null,
  userAnswers: {},
  results: null,
  isLoading: false,
  submissionLoading: false,
  error: null,
  // Added for lesson context
  currentLessonId: null,
  currentCurriculumId: null
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.userAnswers[questionId] = answer;
    },
    clearAssessment: (state) => {
      Object.assign(state, initialState);
    },
    // New: Initialize lesson context
    setAssessmentContext: (state, action) => {
      const { curriculumId, lessonId } = action.payload;
      state.currentCurriculumId = curriculumId;
      state.currentLessonId = lessonId;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAssessment = action.payload;
        state.userAnswers = {};
        state.results = null;
      })
      .addCase(generateAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitAssessment.pending, (state) => {
        state.submissionLoading = true;
        state.error = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.submissionLoading = false;
        state.results = action.payload;
        // Persist answers for review
        state.currentAssessment = {
          ...state.currentAssessment,
          questions: state.currentAssessment.questions.map(q => ({
            ...q,
            userAnswer: state.userAnswers[q._id]
          }))
        };
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.submissionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setAnswer, clearAssessment, setAssessmentContext } = assessmentSlice.actions;
export default assessmentSlice.reducer;