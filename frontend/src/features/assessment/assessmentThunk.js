import { createAsyncThunk } from '@reduxjs/toolkit';
import * as assessmentApi from '../../api/ai-tutor/assessment';

export const getAssessment = createAsyncThunk(
  'assessment/getAssessment',
  async (assessmentId, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getAssessment(assessmentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateAssessment = createAsyncThunk(
  'assessment/generateAssessment',
  async ({ curriculumId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.generateAssessment({ curriculumId, lessonId });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitAssessment = createAsyncThunk(
  'assessment/submitAssessment',
  async ({ assessmentId, answers }, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.submitAssessment({ assessmentId, answers });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);