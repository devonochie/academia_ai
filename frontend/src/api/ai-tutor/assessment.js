import axiosInstance from "../axios"


const generateAssessment= async ({  curriculumId, lessonId }) => {
   try {
      const response = await axiosInstance.post('/assessments/generate', {
         curriculumId,
        lessonId
      })
      return response.data
   } catch (error) {
      console.error('Generate curriculum error:', error)
      throw error
   }
}

const getAssessment = async (assessmentId) => {
   try {
      const response = await axiosInstance.get(`/assessments/${assessmentId}`)
      return response.data
   } catch (error) {
      console.error('Get assessment error:', error)
      throw error
   }
}

const submitAssessment = async ({ assessmentId, answers }) => {
   try {
      const response = await axiosInstance.post(`/assessments/${assessmentId}/submit`, {
         answers
      })
      return response.data
   } catch (error) {
      console.error('Submit assessment error:', error)
      throw error
   }
}

export const assessmentApi = {
   generateAssessment,
   getAssessment,
   submitAssessment
}




