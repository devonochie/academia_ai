import { createSlice } from '@reduxjs/toolkit';
import { getUserProgress, updateProgress } from './progressThunk';

const initialState = {
  progressData: [],
  isLoading: false,
  error: null
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get User Progress cases
      .addCase(getUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progressData = action.payload || [];
      })
      .addCase(getUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Progress cases
      .addCase(updateProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload) return;

        const updatedProgress = action.payload;
        const existingIndex = state.progressData.findIndex(
          p => p.curriculum_id?._id?.toString() === updatedProgress.curriculum_id?._id?.toString() ||
            p.curriculum_id?.toString() === updatedProgress.curriculum_id?.toString()
        );

        if (existingIndex >= 0) {
          state.progressData[existingIndex] = updatedProgress;
        } else {
          state.progressData.push(updatedProgress);
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProgressError } = progressSlice.actions;
export default progressSlice.reducer;