import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth";


const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      console.log("Login response:", response);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const loadUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
        const response =  await authApi.me();
        return response;
      } catch (error) {
      console.error("Fetch user info error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch user info");
    }
});

const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);


const forgotUserPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      return rejectWithValue(error.response?.data || "Forgot password failed");
    }
  }
);

const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      return rejectWithValue(error.response?.data || "Reset password failed");
    }
  }
);


export {
  registerUser,
  resetUserPassword,
  loginUser,
  loadUser,
  logoutUser,
  forgotUserPassword
};