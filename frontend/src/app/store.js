/* eslint-disable no-undef */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import { persistReducer, persistStore, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from 'redux-persist';
import authReducer from '../features/auth/authSlice';
import curriculumReducer from '../features/curriculum/curriculumSlice'
import lessonReducer from '../features/lesson/lessonSlice'
import recommendationReducer from '../features/recommendation/recommendationSlice'
import assessmentReducer from '../features/assessment/assessmentSlice'
import progressReducer from '../features/progress/progressSlice'
import paraphraseReducer from '../features/paraphraser/paraphraserSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

const rootReducer = combineReducers({
  curriculum: curriculumReducer,
  lesson: lessonReducer,
  auth: authReducer,
  recommendation: recommendationReducer,
  assessment: assessmentReducer,
  progress: progressReducer,
  paraphraser: paraphraseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store);

export default store;


