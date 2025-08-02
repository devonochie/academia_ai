import axiosInstance from "../axios";

const generateLessonContent = async ({ curriculumId, moduleId, lessonId, preferences }) => {
  try {
    const response = await axiosInstance.post(
      `/curricula/${curriculumId}/modules/${moduleId}/lessons/${lessonId}/generate-content`,
      { preferences },
    );
    return response.data;
  } catch (error) {
    console.error('Generate lesson content error:', error);
    throw error;
  }
};

const getLessonContent = async ({ curriculumId, lessonId }) => {
  try {
    const response = await axiosInstance.get(
      `/curricula/${curriculumId}/lessons/${lessonId}/content`,
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get lesson content error:', error);
    throw error;
  }
};

const submitLessonAssessment = async ({ curriculumId, moduleId, lessonId, answers }) => {
  try {
    const response = await axiosInstance.post(
      `/curricula/${curriculumId}/modules/${moduleId}/lessons/${lessonId}/assessment`,
      { 
        responses: Object.values(answers) 
      });
    return response.data;
  } catch (error) {
    console.error('Submit lesson assessment error:', error);
    throw error;
  }
};

export {
  getLessonContent,
  generateLessonContent,
  submitLessonAssessment

};