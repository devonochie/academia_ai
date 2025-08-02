import { createAsyncThunk } from '@reduxjs/toolkit';
import * as curriculumApi from '../../api/ai-tutor/curriculum'

export const generateCurriculum = createAsyncThunk(
  'curriculum/generate',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.generateCurriculum(payload)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Generation failed');
    }
  }
);

export const getCurriculum = createAsyncThunk(
  'curriculum/get',
  async (id, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getCurriculum(id)
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const getCurricula = createAsyncThunk(
  'curriculum/getCurricula',
  async (_, { rejectWithValue }) => {
    try {
      const response = await curriculumApi.getCurricula()
      return response || []
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const updateCurriculum = createAsyncThunk(
  'curriculum/update',
  async ({ id, updateData }, { rejectWithValue }) => { // Now accepts both ID and data
    try {
      const response = await curriculumApi.updateCurriculum(id, updateData);
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);