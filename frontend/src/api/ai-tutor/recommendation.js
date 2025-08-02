import axiosInstance from "../axios";

const generateRecommendations = async (conversationHistory) => {
   try {
      const response = await axiosInstance.post('/recommendations', { conversationHistory })
      return response.data
   } catch (error) {
      console.error('Recommendation generation error:', error)
      throw error
   }
}

const getUserRecommendations = async () => {
   try {
      const response = await axiosInstance.get('/recommendations',{
      params: { populate: 'compatibility.matched_resources' }
    })
      return response.data
   } catch (error) {
      console.error('Fetch recommendation error:', error)
      throw error
   }
}

export {
   getUserRecommendations,
   generateRecommendations
}