
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import ProductScan from '@/pages/mobile/ProductScan';
import ProductManagement from '@/pages/mobile/ProductManagement';
import MobileAccount from '@/pages/mobile/MobileAccount';
import MobileInventory from '@/pages/mobile/MobileInventory';
import { ProtectedRoute } from '@/components/mobile/auth/ProtectedRoute';
import CameraTest from '@/pages/CameraTest';
import NotFound from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/inventory" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MobileLayout>
            <MobileInventory />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/scan" element={
        <ProtectedRoute>
          <MobileLayout>
            <ProductScan />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/products/add" element={
        <ProtectedRoute>
          <MobileLayout>
            <ProductManagement />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <MobileLayout>
            <MobileInventory />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/account" element={
        <ProtectedRoute>
          <MobileLayout>
            <MobileAccount />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/camera-test" element={<CameraTest />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
