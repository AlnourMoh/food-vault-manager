
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
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
import { toast } from '@/hooks/use-toast';

const MobileApp = () => {
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const DOUBLE_PRESS_DELAY = 300; // 300ms window for double press
  const { isOnline } = useNetworkStatus();
  const { 
    isConnectedToServer, 
    errorInfo, 
    checkServerConnection, 
    forceReconnect,
    isChecking 
  } = useServerConnection();
  
  const [networkError, setNetworkError] = useState<{
    show: boolean;
    errorCode?: string;
    additionalInfo?: string;
    url?: string;
  }>({
    show: false
  });
  
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [lastNetworkEvent, setLastNetworkEvent] = useState<Date | null>(null);

  // Function to check connection status more comprehensively
  const checkConnection = async () => {
    try {
      // Changing this to use Capacitor Network API for more reliable results
      if (window.Capacitor) {
        const networkStatus = await Network.getStatus();
        console.log('Network status from Capacitor:', networkStatus);
        
        if (!networkStatus.connected) {
          setNetworkError({
            show: true,
            errorCode: "net::ERR_INTERNET_DISCONNECTED",
            additionalInfo: "لا يوجد اتصال بالإنترنت - تم اكتشافه بواسطة Capacitor Network"
          });
          return;
        }
      }
      
      // If online according to Capacitor, check server connection
      if (isOnline) {
        await checkServerConnection();
      } else {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED", 
          additionalInfo: "جهازك غير متصل بالإنترنت"
        });
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setNetworkError({
        show: true,
        errorCode: "net::ERR_CONNECTION_CHECK_FAILED",
        additionalInfo: `خطأ أثناء التحقق من الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      });
    }
  };

  // Use effect to monitor changes in online status
  useEffect(() => {
    const setupNetworkListeners = async () => {
      if (window.Capacitor) {
        // Use Capacitor's Network API for more reliable network status
        await Network.addListener('networkStatusChange', status => {
          console.log('Network status changed:', status);
          setLastNetworkEvent(new Date());
          
          if (status.connected) {
            toast({
              title: "تم استعادة الاتصال",
              description: "جاري التحقق من الاتصال بالخادم...",
            });
            
            // Small delay to allow network to stabilize
            setTimeout(() => {
              checkConnection();
            }, 1500);
          } else {
            setNetworkError({
              show: true,
              errorCode: "net::ERR_INTERNET_DISCONNECTED",
              additionalInfo: "انقطع الاتصال بالإنترنت"
            });
            
            toast({
              variant: "destructive",
              title: "انقطع الاتصال",
              description: "لا يوجد اتصال بالإنترنت",
            });
          }
        });
        
        // Initial check
        const initialStatus = await Network.getStatus();
        console.log('Initial network status:', initialStatus);
        
        if (!initialStatus.connected) {
          setNetworkError({
            show: true,
            errorCode: "net::ERR_INTERNET_DISCONNECTED",
            additionalInfo: "جهازك غير متصل بالإنترنت"
          });
        } else {
          checkServerConnection();
        }
      } else {
        // Fallback to browser APIs if Capacitor is not available
        window.addEventListener('online', () => {
          toast({
            title: "تم استعادة الاتصال",
            description: "جاري التحقق من الاتصال بالخادم...",
          });
          
          setLastNetworkEvent(new Date());
          checkConnection();
        });
        
        window.addEventListener('offline', () => {
          setLastNetworkEvent(new Date());
          setNetworkError({
            show: true,
            errorCode: "net::ERR_INTERNET_DISCONNECTED",
            additionalInfo: "انقطع الاتصال بالإنترنت"
          });
          
          toast({
            variant: "destructive",
            title: "انقطع الاتصال",
            description: "لا يوجد اتصال بالإنترنت",
          });
        });
        
        // Initial check using browser API
        if (!navigator.onLine) {
          setNetworkError({
            show: true,
            errorCode: "net::ERR_INTERNET_DISCONNECTED",
            additionalInfo: "جهازك غير متصل بالإنترنت"
          });
        } else {
          checkServerConnection();
        }
      }
    };
    
    setupNetworkListeners();
    
    return () => {
      if (window.Capacitor) {
        Network.removeAllListeners();
      } else {
        window.removeEventListener('online', () => {});
        window.removeEventListener('offline', () => {});
      }
    };
  }, []);

  // Update network error state based on server connection
  useEffect(() => {
    if (!isConnectedToServer && isOnline && !isChecking) {
      setNetworkError({
        show: true,
        errorCode: "net::ERR_HTTP_RESPONSE_CODE_FAILURE",
        additionalInfo: errorInfo,
        url: window.location.href
      });
    } else if (isConnectedToServer) {
      setNetworkError({ show: false });
    }
  }, [isConnectedToServer, errorInfo, isOnline, isChecking]);

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
              
              // Show a toast indicating that a second press will minimize the app
              toast({
                title: "اضغط مرة أخرى للخروج",
                duration: 2000,
              });
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
  const handleRetryConnection = async () => {
    setRetryAttempt(prev => prev + 1);
    
    toast({
      title: "جاري التحقق من الاتصال",
      description: "يرجى الانتظار...",
    });
    
    try {
      const success = await forceReconnect();
      
      if (success) {
        setNetworkError({ show: false });
        toast({
          title: "تم استعادة الاتصال",
          description: "تم الاتصال بالخادم بنجاح",
        });
      } else {
        toast({
          variant: "destructive",
          title: "فشل الاتصال",
          description: "فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى",
        });
      }
    } catch (error) {
      console.error("Error during retry:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء محاولة الاتصال بالخادم",
      });
    }
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
