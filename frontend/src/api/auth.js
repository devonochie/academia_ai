import axiosInstance from "./axios"

const register = async (userData) => {
   try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
   } catch (error) {
      console.error('Registration error:', error);
      throw error;
   }
}
const login = async (credentials) => {
   try {
      const response = await axiosInstance.post(
         '/auth/login',
         credentials,
      );
      return response.data;
   }
   catch (error) {
      console.error('Login error:', error);
      throw error;
   }
}

const me = async () => {
   try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
   } catch (error) {
      console.error('Fetch user info error:', error);
      throw error;
   }
}

const logout = async () => {
   try {
      const response = await axiosInstance.post('/auth/logout',);
      return response.data;
   } catch (error) {
      console.error('Logout error:', error);
      throw error;
   }
}

const forgotPassword = async (email) => {
   try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
   } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
   }
}

const resetPassword = async (token, newPassword) => {
   try {
      const response = await axiosInstance.post(
         '/auth/reset-password',
         { newPassword },
         {
            params: { token }
         }
      );
      return response.data;
   } catch (error) {
      console.error('Reset password error:', error);
      throw error;
   }
}

const refreshToken = async () => {
   try {
      const response = await axiosInstance.post('/auth/refresh-token');
      return response.data;
   } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
   }
}

export {
   register,
   login,
   me,
   logout,
   forgotPassword,
   resetPassword,
   refreshToken
};