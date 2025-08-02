import axiosInstance from "../axios";

const getUserProgress = async () => {
   try {
      const response = await axiosInstance.get('/progress');
      return response.data;
   } catch (error) {
      console.error('Fetching user progress error:', error);
      throw error;
   }
};

const updateProgress = async ({ curriculumId, moduleId, lessonId,status }) => {
   try {
      const response = await axiosInstance.post(
         '/progress',
         { curriculumId, moduleId, lessonId, status });
      return response.data
   } catch (error) {
      console.error('Updating progress error:', error);
      throw error;
   }
};

export {
   updateProgress,
   getUserProgress
}