import { createAsyncThunk } from '@reduxjs/toolkit';
import * as progressApi from '../../api/ai-tutor/progress';

export const getUserProgress = createAsyncThunk(
  'progress/get',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await progressApi.getUserProgress();
      return Array.isArray(data?.progress) ? data.progress : [];
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to fetch progress',
        details: err.response?.data
      });
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/update',
  async ({ curriculumId, moduleId, lessonId, status, quizResult }, { rejectWithValue }) => {
    try {
      const { data } = await progressApi.updateProgress({
        curriculumId,
        moduleId,
        lessonId,
        status,
        quizResult
      });
      return data?.data || data; 
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to update progress',
        details: err.response?.data
      });
    }
  }
);