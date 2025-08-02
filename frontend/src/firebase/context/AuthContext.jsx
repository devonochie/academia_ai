import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config';
import { loginUser, registerUser } from '../../features/auth/authThunk';
import { setError, setMessage } from '../../features/auth/authSlice';


const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
   const [firebaseUser, setFirebaseUser] = React.useState(null);
   const dispatch = useDispatch();

   const signIn = async ( email, password) => {
      try {
         // Assuming you have a loginUser thunk that handles the login logic
         await dispatch(loginUser({ email, password })).unwrap();
         dispatch(setMessage('Login successful!'));
      } catch (error) {
         dispatch(setError(error.message));
      }
   }

   const signUp = async (name, email, password) => {
      try {
         // Assuming you have a registerUser thunk that handles the registration logic
         await dispatch(registerUser({ name, email, password })).unwrap();
         dispatch(setMessage('Account created successfully!'));
      } catch (error) {
         dispatch(setError(error.message));
      }
   }  

   const googleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
         const result = await signInWithPopup(auth, provider);
         const user = result.user;
         setFirebaseUser(user);
         dispatch(setMessage('Google login successful!'));
      } catch (error) {
         dispatch(setError(error.message));
      }
   }

   const signOut = async () => {
      try {
         await firebaseSignOut(auth);
         setFirebaseUser(null);
         dispatch(setMessage('Logout successful!'));
      } catch (error) {
         dispatch(setError(error.message));
      }
   }


   return (
      <AuthContext.Provider value={{firebaseUser,
      setFirebaseUser,
      signIn,
      signUp,
      googleSignIn,
      signOut
      }}>
         {children}
      </AuthContext.Provider>
   ) 
}


export { AuthContext, AuthProvider };