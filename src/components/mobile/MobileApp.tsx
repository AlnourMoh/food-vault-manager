
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
import { useNetworkStatus } from '@/hooks/network/useNetworkStatus';
import { useServerConnection } from '@/hooks/network/useServerConnection';
import NetworkErrorView from './NetworkErrorView';

const MobileApp = () => {
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const DOUBLE_PRESS_DELAY = 300; // 300ms window for double press
  const { isOnline } = useNetworkStatus();
  const { isConnectedToServer, errorInfo, checkServerConnection } = useServerConnection();
  const [networkError, setNetworkError] = useState<{
    show: boolean;
    errorCode?: string;
    additionalInfo?: string;
    url?: string;
  }>({
    show: false
  });

  useEffect(() => {
    // Check server connection when online status changes
    if (isOnline) {
      checkServerConnection();
    } else {
      setNetworkError({
        show: true,
        errorCode: "net::ERR_INTERNET_DISCONNECTED",
        additionalInfo: "No internet connection detected"
      });
    }
  }, [isOnline, checkServerConnection]);

  useEffect(() => {
    // Update network error state based on server connection
    if (!isConnectedToServer && isOnline) {
      setNetworkError({
        show: true,
        errorCode: "net::ERR_HTTP_RESPONSE_CODE_FAILURE",
        additionalInfo: errorInfo,
        url: window.location.href
      });
    } else if (isConnectedToServer) {
      setNetworkError({ show: false });
    }
  }, [isConnectedToServer, errorInfo, isOnline]);

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

  // Function to retry connection
  const handleRetryConnection = () => {
    checkServerConnection();
  };

  // Check authentication status
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // If there's a network error, show the network error view
  if (networkError.show) {
    return (
      <NetworkErrorView 
        onRetry={handleRetryConnection}
        errorCode={networkError.errorCode}
        additionalInfo={networkError.additionalInfo}
        url={networkError.url}
      />
    );
  }
  
  // Force login page when not authenticated
  if (!isRestaurantLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<RestaurantLogin />} />
        <Route path="*" element={<Navigate to="/mobile/login" replace />} />
      </Routes>
    );
  }
  
  // If authenticated and no network error, show the full app
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
