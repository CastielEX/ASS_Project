import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  roleRequired: 'admin' | 'user'; // Type annotation for the allowed roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired }) => {
  const token = localStorage.getItem('token');

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    // Decode the JWT token to get the user role
    const decodedToken = jwtDecode<{ role: 'admin' | 'user' }>(token);

    // If the role doesn't match the required role, redirect to "not authorized"
    if (decodedToken.role !== roleRequired) {
      return <Navigate to="/not-authorized" />;
    }

    // Otherwise, render the children components (e.g., the protected route content)
    return <Outlet />;
  } catch (error) {
    // If JWT decoding fails, redirect to login page
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
