import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   user: null,
   isAuthenticated: false,
   error: null,
   success: false,
   message: null,
   isLoading: false,
   isAdmin: false,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
         state.isAuthenticated = true;
         state.error = null;
      },
      clearUser: (state) => {
         state.user = null;
         state.isAuthenticated = false;
         state.error = null;
      },
      setError: (state, action) => {
         state.error = action.payload;
      },
      clearError: (state) => {
         state.error = null;
      },
      setSuccess: (state, action) => {
         state.success = action.payload;
      },
      clearSuccess: (state) => {
         state.success = false;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      clearAuthData: (state) => {
         state.user = null;
         state.isAuthenticated = false;
         state.error = null;
         state.success = false;
         state.isLoading = false;
      },
      setMessage: (state, action) => {
         state.message = action.payload;
      },
      clearMessage: (state) => {
         state.message = null;
      },

      setIsAdmin: (state, action) => {
         state.user.isAdmin = action.payload;
      },
   },
   extraReducers: (builder) => {
      // Add cases for async thunks here if needed
      builder
         .addCase('auth/login/pending', (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase('auth/login/fulfilled', (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
         })
         .addCase('auth/login/rejected', (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Login failed";
         });

      builder
         .addCase('auth/getMe/pending', (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase('auth/getMe/fulfilled', (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
         })
         .addCase('auth/getMe/rejected', (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to fetch user info";
            state.user = null;
            state.isAuthenticated = false;
         });
   },
})

export const {
   setUser,
   clearUser,
   setError,
   clearError,
   setSuccess,
   clearSuccess,
   setLoading,
   clearAuthData,
   setMessage,
   clearMessage,
   setIsAdmin
} = authSlice.actions;

export default authSlice.reducer;