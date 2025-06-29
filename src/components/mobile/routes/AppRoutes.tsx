
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import ProductScan from '@/pages/mobile/ProductScan';
import ScanProductRedirect from '@/pages/mobile/ScanProductRedirect';
import ProductManagement from '@/pages/mobile/ProductManagement';
import MobileAccount from '@/pages/mobile/MobileAccount';
import MobileInventory from '@/pages/mobile/MobileInventory';
import { ProtectedRoute } from '@/components/mobile/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* توجيه مسار تسجيل الدخول إلى المخزون مباشرة */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      
      {/* الصفحة الرئيسية تعرض المخزون */}
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
      
      {/* Add the scan-product route that uses the redirect component */}
      <Route path="/scan-product" element={
        <ProtectedRoute>
          <MobileLayout>
            <ScanProductRedirect />
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
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
