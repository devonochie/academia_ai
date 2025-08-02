import { createSlice } from "@reduxjs/toolkit";
import { generateLessonContent, getLessonContent } from "./lessonThunk";

const initialState = {
   currentLesson: null,
   isLoading: false,
   error: null
}

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLessonContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateLessonContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLesson = action.payload.data;
      })
      .addCase(generateLessonContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getLessonContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLessonContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLesson = action.payload.data;
      })
      .addCase(getLessonContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  }
});

export const { clearCurrentLesson } = lessonSlice.actions;
export default lessonSlice.reducer;