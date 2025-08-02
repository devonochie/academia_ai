import { createAsyncThunk } from "@reduxjs/toolkit";
import * as lessonApi from '../../api/ai-tutor/lesson'


export const generateLessonContent = createAsyncThunk(
  'lesson/generate',
  async ({ curriculumId, moduleId, lessonId, preferences }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.generateLessonContent({curriculumId, moduleId, lessonId, preferences})
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Generation failed');
    }
  }
);

export const getLessonContent = createAsyncThunk(
  'lesson/get',
  async ( {curriculumId, lessonId} , { rejectWithValue }) => {
    try {
      const response = await lessonApi.getLessonContent({ curriculumId, lessonId })
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);


export const submitLessonAssessment = createAsyncThunk(
  'lesson/submitAssessment',
  async ({ curriculumId, moduleId, lessonId, answers }, { rejectWithValue }) => {
    try {
      const response = await lessonApi.submitLessonAssessment({ curriculumId, moduleId, lessonId, answers })
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Submission failed');
    }
  }
);