
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RestaurantLogin from '@/pages/RestaurantLogin';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<RestaurantLogin />} />
      <Route path="*" element={<Navigate to="/mobile/login" replace />} />
    </Routes>
  );
};
