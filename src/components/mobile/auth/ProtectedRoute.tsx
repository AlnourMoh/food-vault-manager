
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMobileAuth } from '@/hooks/auth/useMobileAuth';
import { useMobileConnection } from '@/hooks/network/useMobileConnection';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isRestaurantLoggedIn } = useMobileAuth();
  const { showErrorScreen } = useMobileConnection();
  const location = useLocation();
  
  // If not logged in, redirect to login
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/mobile/login" state={{ from: location }} replace />;
  }
  
  // If logged in and there's a connection, render the children
  return <>{children}</>;
};
