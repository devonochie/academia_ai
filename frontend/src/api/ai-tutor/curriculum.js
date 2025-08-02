import axiosInstance from "../axios"


const generateCurriculum = async (payload) => {
   try {
      const response = await axiosInstance.post("/curricula/generate", payload)
      return response.data
   } catch (error) {
      console.error('Generate curriculum error:', error)
      throw error
   }
}


const getCurriculum = async (id) => {
   try {
      const response = await axiosInstance.get(`/curricula/${id}`)
      return response.data
   } catch (error) {
      console.error('Fetching currriculum error:', error)
      throw error
   }
}

const getCurricula = async () => {
   try {
      const response = await axiosInstance.get('/curricula')
      return response.data
   } catch (error) {
      console.error('Fetching currriculum error:', error)
      throw error
   }
}


const updateCurriculum = async (id) => {
   try {
      const response = await axiosInstance.put(`/curricula/${id}`)
      return response.data
   } catch (error) {
      console.error('Updating curriculum error:', error)
      throw error
   }
}


export {
   updateCurriculum,
   getCurriculum,
   getCurricula,
   generateCurriculum
}