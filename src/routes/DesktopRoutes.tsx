import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WebsiteRoutes } from './website/WebsiteRoutes';
import { AdminRoutes } from './admin/AdminRoutes';
import { RestaurantRoutes } from './restaurant/RestaurantRoutes';
import NotFound from '@/pages/NotFound';
import MobileApp from '@/components/mobile/MobileApp';
import ProductScan from '@/pages/mobile/ProductScan';
import MobileInventory from '@/pages/mobile/MobileInventory';

export const DesktopRoutes = () => {
  return (
    <Routes>
      {/* Website Routes */}
      {WebsiteRoutes.map((route, index) => (
        <React.Fragment key={`website-route-${index}`}>{route}</React.Fragment>
      ))}
      
      {/* Admin Routes */}
      {AdminRoutes.map((route, index) => (
        <React.Fragment key={`admin-route-${index}`}>{route}</React.Fragment>
      ))}
      
      {/* Restaurant Routes */}
      {RestaurantRoutes.map((route, index) => (
        <React.Fragment key={`restaurant-route-${index}`}>{route}</React.Fragment>
      ))}
      
      {/* Redirect legacy routes */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/restaurants" element={<Navigate to="/admin/restaurants" replace />} />
      <Route path="/restaurants/:id/credentials" element={<Navigate to="/admin/restaurants/:id/credentials" replace />} />
      <Route path="/restaurants/:id/edit" element={<Navigate to="/admin/restaurants/:id/edit" replace />} />
      
      {/* Direct inventory access */}
      <Route path="/inventory" element={<MobileInventory />} />
      
      {/* Direct scan routes for both desktop and mobile access */}
      <Route path="/scan" element={<ProductScan />} />
      <Route path="/scan-product" element={<Navigate to="/scan" replace />} />
      
      {/* Mobile route for desktop testing */}
      <Route path="/mobile/*" element={<MobileApp />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
