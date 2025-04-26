
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToServer, setIsConnectedToServer] = useState(true);
  const [serverCheckDone, setServerCheckDone] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    // Listen for network status changes
    const handleOnline = () => {
      console.log('Network status changed: online');
      setIsOnline(true);
      checkServerConnection();
    };
    
    const handleOffline = () => {
      console.log('Network status changed: offline');
      setIsOnline(false);
      setIsConnectedToServer(false);
      setServerCheckDone(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial server connection check
    checkServerConnection();
    
    const setupCapacitor = async () => {
      if (window.Capacitor) {
        console.log('Capacitor is available, setting up listeners');
        // Listen for the hardware back button (Android)
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          console.log('Back button pressed, canGoBack:', canGoBack);
          if (canGoBack) {
            window.history.back();
          } else {
            // If we're at the root, ask if they want to exit the app
            CapacitorApp.exitApp();
          }
        });
      } else {
        console.log('Capacitor is not available in this environment');
      }
    };
    
    setupCapacitor();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (window.Capacitor) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [retryCount]);

  // Function to check if we can connect to Supabase server
  const checkServerConnection = async () => {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping server connection check');
      setIsConnectedToServer(false);
      setServerCheckDone(true);
      return;
    }
    
    console.log('Checking server connection...');
    try {
      // Simple health check to Supabase
      const startTime = Date.now();
      const { data, error } = await supabase.from('companies').select('count', { count: 'exact', head: true });
      const responseTime = Date.now() - startTime;
      
      console.log(`Server responded in ${responseTime}ms`);
      
      if (error) {
        console.error('Server connection check failed:', error.message);
        setErrorInfo(`خطأ في الاتصال بالخادم: ${error.message}`);
        setIsConnectedToServer(false);
      } else {
        console.log('Server connection check passed');
        setIsConnectedToServer(true);
        
        // Show toast on reconnection after failure
        if (!isConnectedToServer && serverCheckDone) {
          toast({
            title: "تم استعادة الاتصال",
            description: "تم استعادة الاتصال بالخادم بنجاح",
          });
        }
      }
    } catch (error) {
      console.error('Server connection check failed with exception:', error);
      setErrorInfo(`استثناء أثناء الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      setIsConnectedToServer(false);
    } finally {
      setServerCheckDone(true);
    }
  };

  const handleRetry = () => {
    // Increase retry count to force re-render
    setRetryCount(prev => prev + 1);
    
    // Reset states
    setServerCheckDone(false);
    setIsConnectedToServer(true);
    
    // Check network status again
    setIsOnline(navigator.onLine);
    
    // Clear error info
    setErrorInfo('');
    
    // Check server connection
    checkServerConnection();
    
    console.log('Retry attempt:', retryCount + 1);
    
    toast({
      title: "محاولة إعادة الاتصال",
      description: "جاري التحقق من حالة الشبكة والاتصال بالخادم",
    });
  };
  
  // Show loading state while checking server connection
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
  
  // Show network error view if device is offline or can't connect to server
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
