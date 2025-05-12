
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from '@/components/mobile/MobileApp';
import NotFound from '@/pages/NotFound';

export const MobileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mobile/login" replace />} />
      <Route path="/mobile/*" element={<MobileApp />} />
      {/* Direct root scan-product path for mobile */}
      <Route path="/scan-product" element={<Navigate to="/mobile/scan" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
