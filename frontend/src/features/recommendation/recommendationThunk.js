import { createAsyncThunk } from '@reduxjs/toolkit';
import * as recommendationApi from '../../api/ai-tutor/recommendation'


export const generateRecommendations = createAsyncThunk(
  'recommendation/generate',
  async ({ conversationHistory }, { rejectWithValue }) => {
    try {
      const response = await recommendationApi.generateRecommendations(conversationHistory );
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Generation failed');
    }
  }
);

export const getUserRecommendations = createAsyncThunk(
  'recommendation/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recommendationApi.getUserRecommendations()
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);