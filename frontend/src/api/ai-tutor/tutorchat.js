import axiosInstance from "../axios";

export const createSession = async (topic) => {
   try {
      const response = await axiosInstance.post('/sessions', { topic });
      return response.data;
   } catch (error) {
      throw new Error(error.response?.data || error.message);
   }
}


export const sendMessage = async ({ sessionId, message }) => {
   try {
      const response = await axiosInstance.post(`/sessions/${sessionId}/chat`, { message });
      return response.data;
   } catch (error) {
         throw new Error(error.response?.data || error.message);
   }
}  



