import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import MobileLayout from '@/components/layout/MobileLayout';
import MobileHome from '@/pages/mobile/MobileHome';
import ProductScan from '@/pages/mobile/ProductScan';
import ProductManagement from '@/pages/mobile/ProductManagement';
import MobileAccount from '@/pages/mobile/MobileAccount';
import RestaurantLogin from '@/pages/RestaurantLogin';
import NetworkErrorView from '@/components/mobile/NetworkErrorView';
import MobileInventory from '@/pages/mobile/MobileInventory';
import { useNetworkStatus } from '@/hooks/network/useNetworkStatus';
import { useServerConnection } from '@/hooks/network/useServerConnection';

// Auth guard component to protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  const location = useLocation();
  
  if (!isRestaurantLoggedIn) {
    return <Navigate to="/mobile/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const MobileApp = () => {
  const { isOnline } = useNetworkStatus();
  const { 
    isConnectedToServer, 
    serverCheckDone, 
    errorInfo,
    checkServerConnection, 
    setServerCheckDone,
    setIsConnectedToServer 
  } = useServerConnection();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isOnline) {
      checkServerConnection();
    }
    
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
      } else {
        console.log('Capacitor is not available in this environment');
      }
    };
    
    setupCapacitor();
    
    return () => {
      if (window.Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [isOnline, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setServerCheckDone(false);
    setIsConnectedToServer(true);
    checkServerConnection();
  };
  
  if (!serverCheckDone) {
    return (
      <div className="rtl min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">جاري التحقق من الاتصال...</p>
        </div>
      </div>
    );
  }
  
  if (!isOnline || !isConnectedToServer) {
    return (
      <NetworkErrorView 
        onRetry={handleRetry} 
        additionalInfo={errorInfo} 
      />
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={<RestaurantLogin />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MobileLayout>
            <MobileHome />
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
