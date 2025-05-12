
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebsiteRoutes } from './website/WebsiteRoutes';
import { AdminRoutes } from './admin/AdminRoutes';
import { RestaurantRoutes } from './restaurant/RestaurantRoutes';
import NotFound from '@/pages/NotFound';
import MobileApp from '@/components/mobile/MobileApp';

export const DesktopRoutes = () => {
  return (
    <Routes>
      {/* Website Routes */}
      <WebsiteRoutes />
      
      {/* Admin Routes */}
      <AdminRoutes />
      
      {/* Restaurant Routes */}
      <RestaurantRoutes />
      
      {/* Mobile route for desktop testing */}
      <Route path="/mobile/*" element={<MobileApp />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
