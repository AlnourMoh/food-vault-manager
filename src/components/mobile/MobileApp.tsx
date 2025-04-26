
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
    retryCount,
    handleRetry,
    checkServerConnection,
    setIsInitialLoading,
    setInitialCheckDone,
    initialCheckDone,
    isInitialLoading,
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
    
    // On initial load, check connection once
    const checkConnection = async () => {
      try {
        await checkServerConnection();
      } finally {
        // Always continue to the app after a short delay
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
  
  // If authenticated, show the full app regardless of connection status
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
      
      <Route path="*" element={<Navigate to="/inventory" replace />} />
    </Routes>
  );
};

export default MobileApp;
