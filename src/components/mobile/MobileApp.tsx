import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import MobileLayout from '@/components/layout/MobileLayout';
import ProductScan from '@/pages/mobile/ProductScan';
import ProductManagement from '@/pages/mobile/ProductManagement';
import MobileAccount from '@/pages/mobile/MobileAccount';
import RestaurantLogin from '@/pages/RestaurantLogin';
import MobileInventory from '@/pages/mobile/MobileInventory';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { InitialLoading } from './common/InitialLoading';
import { useMobileConnection } from '@/hooks/network/useMobileConnection';

const MobileApp = () => {
  const {
    showErrorScreen,
    isInitialLoading,
    retryCount,
    handleRetry,
    checkServerConnection,
    setIsInitialLoading,
    setInitialCheckDone,
    initialCheckDone,
    errorInfo
  } = useMobileConnection();
  
  useEffect(() => {
    const setupCapacitor = async () => {
      if (window.Capacitor) {
        console.log('Capacitor is available, setting up listeners');
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('Back button pressed, canGoBack:', canGoBack);
          if (canGoBack) {
            window.history.back();
          } else {
            CapacitorApp.exitApp();
          }
        });
      }
    };
    
    const checkConnection = async () => {
      try {
        await checkServerConnection();
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
          setInitialCheckDone(true);
        }, 2000);
      }
    };
    
    if (!initialCheckDone) {
      checkConnection();
    }
    
    setupCapacitor();
    
    return () => {
      if (window.Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [checkServerConnection, initialCheckDone, setInitialCheckDone, setIsInitialLoading]);

  if (isInitialLoading) {
    return <InitialLoading />;
  }
  
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  if (!isRestaurantLoggedIn && showErrorScreen) {
    return <Navigate to="/mobile/login" replace />;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<RestaurantLogin />} />
      
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
            <MobileInventory key={`inventory-${retryCount}`} />
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
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MobileApp;
