
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from '@/components/mobile/MobileApp';
import NotFound from '@/pages/NotFound';
import ProductScan from '@/pages/mobile/ProductScan';
import MobileInventory from '@/pages/mobile/MobileInventory';

export const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mobile" replace />} />
      <Route path="/mobile/*" element={<MobileApp />} />
      
      {/* صفحة المخزون مباشرة */}
      <Route path="/inventory" element={<MobileInventory />} />
      
      {/* مسارات المسح المباشرة للهاتف المحمول */}
      <Route path="/scan" element={<ProductScan />} />
      <Route path="/scan-product" element={<Navigate to="/scan" replace />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
