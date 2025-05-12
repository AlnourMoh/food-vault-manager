
import React from 'react';
import { Navigate } from 'react-router-dom';

// Restaurant guards
export const RestaurantGuard = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/restaurant/login" replace />;
  }
  
  return <>{children}</>;
};

export const RestaurantLoginGuard = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  if (isRestaurantLoggedIn) {
    return <Navigate to="/restaurant" replace />;
  }
  
  return <>{children}</>;
};

export const RestaurantSetupGuard = ({ children }: { children: React.ReactNode }) => {
  // We allow setup without checking login status
  return <>{children}</>;
};

// Admin guards
export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export const AdminLoginGuard = ({ children }: { children: React.ReactNode }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
  
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};
