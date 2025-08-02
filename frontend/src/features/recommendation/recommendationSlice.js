import { createSlice } from "@reduxjs/toolkit";
import { generateRecommendations, getUserRecommendations } from "./recommendationThunk";

const initialState = {
   recommendations: [],
   currentRecommendation: null,
   isLoading: false,
   error: null
}

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    clearCurrentRecommendation: (state) => {
      state.currentRecommendation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecommendation = action.payload.data;
        state.recommendations.push(action.payload.data);
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null
      })
      .addCase(getUserRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload.data;
      })
      .addCase(getUserRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentRecommendation } = recommendationSlice.actions;
export default recommendationSlice.reducer;