import React from 'react';
import { AuthContext } from '../firebase/context/AuthContext';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { firebaseUser } = React.useContext(AuthContext);
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return isAuthenticated || firebaseUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;