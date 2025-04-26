
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMobileAuth } from '@/hooks/auth/useMobileAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isRestaurantLoggedIn } = useMobileAuth();
  const location = useLocation();
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/mobile/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
