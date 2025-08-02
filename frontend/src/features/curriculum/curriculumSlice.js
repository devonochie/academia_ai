import { createSlice } from "@reduxjs/toolkit";
import { generateCurriculum, getCurricula, getCurriculum, updateCurriculum } from "./curriculumThunk";

const initialState = {
  currentCurriculum: null,
  generatedCurricula: [],
  isLoading: false,
  error: null
}

const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    clearCurrentCurriculum: (state) => {
      state.currentCurriculum = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate Curriculum
      .addCase(generateCurriculum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCurriculum = action.payload.data;
        state.generatedCurricula.unshift(action.payload.data); 
      })
      .addCase(generateCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Single Curriculum
      .addCase(getCurriculum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCurriculum = action.payload.data;
      })
      .addCase(getCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get All Curricula
      .addCase(getCurricula.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurricula.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedCurricula = action.payload.data || [];
      })
      .addCase(getCurricula.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Curriculum
      .addCase(updateCurriculum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurriculum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCurriculum = action.payload.data;
        // Update in generatedCurricula array if exists
        state.generatedCurricula = state.generatedCurricula.map(curriculum => 
          curriculum._id === action.payload.data._id ? action.payload.data : curriculum
        );
      })
      .addCase(updateCurriculum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentCurriculum } = curriculumSlice.actions;
export default curriculumSlice.reducer;