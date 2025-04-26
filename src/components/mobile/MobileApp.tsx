import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import MobileLayout from '@/components/layout/MobileLayout';
import ProductScan from '@/pages/mobile/ProductScan';
import ProductManagement from '@/pages/mobile/ProductManagement';
import MobileAccount from '@/pages/mobile/MobileAccount';
import RestaurantLogin from '@/pages/RestaurantLogin';
import MobileInventory from '@/pages/mobile/MobileInventory';
import { ProtectedRoute } from './auth/ProtectedRoute';

const MobileApp = () => {
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const DOUBLE_PRESS_DELAY = 300; // 300ms window for double press

  useEffect(() => {
    const setupCapacitor = async () => {
      if (window.Capacitor) {
        console.log('Capacitor is available, setting up listeners');
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('Back button pressed, canGoBack:', canGoBack);
          
          const currentTime = Date.now();
          
          if (canGoBack) {
            window.history.back();
          } else {
            // Check if this is a double press
            if (currentTime - lastBackPress <= DOUBLE_PRESS_DELAY) {
              // Double press detected - minimize the app
              CapacitorApp.minimizeApp();
            } else {
              // First press - update timestamp
              setLastBackPress(currentTime);
            }
          }
        });
      }
    };
    
    setupCapacitor();
    
    return () => {
      if (window.Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [lastBackPress]);

  // Check authentication status
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // Force login page when not authenticated
  if (!isRestaurantLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<RestaurantLogin />} />
        <Route path="*" element={<Navigate to="/mobile/login" replace />} />
      </Routes>
    );
  }
  
  // If authenticated, always show the full app without any network checks
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/mobile/inventory" replace />} />
      
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
      
      <Route path="*" element={<Navigate to="/inventory" replace />} />
    </Routes>
  );
};

export default MobileApp;
