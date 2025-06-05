
import React, { Fragment } from 'react';
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
        <Fragment key={`website-route-${index}`}>{route}</Fragment>
      ))}
      
      {/* Admin Routes */}
      {AdminRoutes.map((route, index) => (
        <Fragment key={`admin-route-${index}`}>{route}</Fragment>
      ))}
      
      {/* Restaurant Routes */}
      <Route path="/restaurant/*" element={<RestaurantRoutes />} />
      
      {/* Mobile App Routes */}
      <Route path="/mobile/*" element={<MobileApp />} />
      
      {/* Direct mobile routes for backward compatibility */}
      <Route path="/mobile/inventory" element={<MobileInventory />} />
      <Route path="/mobile/scan" element={<ProductScan />} />
      
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
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
