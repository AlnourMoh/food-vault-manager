
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from '@/components/mobile/MobileApp';
import NotFound from '@/pages/NotFound';
import ProductScan from '@/pages/mobile/ProductScan';

export const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mobile/login" replace />} />
      <Route path="/mobile/*" element={<MobileApp />} />
      
      {/* Direct scan routes for mobile */}
      <Route path="/scan" element={<ProductScan />} />
      <Route path="/scan-product" element={<Navigate to="/scan" replace />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
