
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

  // Function to check connection status more comprehensively - with added error handling
  const checkConnection = async () => {
    try {
      // ادخال معالجة أخطاء أفضل للتحقق من الاتصال
      console.log('Checking connection...');
      
      if (window.Capacitor) {
        try {
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
        } catch (networkError) {
          console.error("Error checking network via Capacitor:", networkError);
          // استمر بالمحاولة عبر طرق أخرى
        }
      }
      
      // If online according to any method, check server connection
      if (navigator.onLine) {
        try {
          await checkServerConnection();
        } catch (serverError) {
          console.error("Error checking server connection:", serverError);
          setNetworkError({
            show: true,
            errorCode: "net::ERR_SERVER_UNREACHABLE",
            additionalInfo: "تعذر الاتصال بالخادم"
          });
        }
      } else {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED", 
          additionalInfo: "جهازك غير متصل بالإنترنت"
        });
      }
    } catch (error) {
      console.error("Error in checkConnection:", error);
      setNetworkError({
        show: true,
        errorCode: "net::ERR_CONNECTION_CHECK_FAILED",
        additionalInfo: `خطأ أثناء التحقق من الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      });
    }
  };

  // استخدام useEffect لمراقبة التغييرات في حالة الاتصال مع تحسين معالجة الأخطاء
  useEffect(() => {
    const setupNetworkListeners = async () => {
      try {
        console.log("Setting up network listeners");
        
        if (window.Capacitor) {
          try {
            // استخدام أسلوب أكثر أمانًا للتسجيل على أحداث الشبكة
            await Network.addListener('networkStatusChange', status => {
              console.log('Network status changed:', status);
              setLastNetworkEvent(new Date());
              
              if (status.connected) {
                toast({
                  title: "تم استعادة الاتصال",
                  description: "جاري التحقق من الاتصال بالخادم...",
                });
                
                // تأخير صغير للسماح للشبكة بالاستقرار
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
            
            // فحص أولي
            const initialStatus = await Network.getStatus();
            console.log('Initial network status:', initialStatus);
            
            if (!initialStatus.connected) {
              setNetworkError({
                show: true,
                errorCode: "net::ERR_INTERNET_DISCONNECTED",
                additionalInfo: "جهازك غير متصل بالإنترنت"
              });
            } else {
              checkServerConnection().catch(err => {
                console.error("Initial server connection check failed:", err);
              });
            }
          } catch (capacitorError) {
            console.error("Error with Capacitor network setup:", capacitorError);
            // استخدم طرق بديلة في حال فشل Capacitor
            setupBrowserFallback();
          }
        } else {
          // استخدام واجهات المتصفح في حالة عدم توفر Capacitor
          setupBrowserFallback();
        }
      } catch (setupError) {
        console.error("Critical error in network setup:", setupError);
        // حاول استخدام واجهات المتصفح في حالة الفشل
        setupBrowserFallback();
      }
    };
    
    // استخدام واجهات برمجة المتصفح كخطة بديلة
    const setupBrowserFallback = () => {
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
      
      // فحص أولي باستخدام واجهة برمجة المتصفح
      if (!navigator.onLine) {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED",
          additionalInfo: "جهازك غير متصل بالإنترنت"
        });
      } else {
        checkServerConnection().catch(err => {
          console.error("Initial server connection check failed:", err);
        });
      }
    };
    
    setupNetworkListeners();
    
    return () => {
      // تنظيف المستمعين
      try {
        if (window.Capacitor) {
          Network.removeAllListeners();
        } else {
          window.removeEventListener('online', () => {});
          window.removeEventListener('offline', () => {});
        }
      } catch (cleanupError) {
        console.error("Error during network listeners cleanup:", cleanupError);
      }
    };
  }, []);

  // تحديث حالة خطأ الشبكة بناءً على الاتصال بالخادم
  useEffect(() => {
    try {
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
    } catch (stateUpdateError) {
      console.error("Error updating network error state:", stateUpdateError);
    }
  }, [isConnectedToServer, errorInfo, isOnline, isChecking]);

  // تحسين إعداد Capacitor مع معالجة أخطاء محسنة
  useEffect(() => {
    const setupCapacitor = async () => {
      try {
        if (window.Capacitor) {
          console.log('Capacitor is available, setting up listeners');
          
          // استخدام نهج أكثر أمانًا للتسجيل على أحداث زر الرجوع
          await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            console.log('Back button pressed, canGoBack:', canGoBack);
            
            try {
              const currentTime = Date.now();
              
              if (canGoBack) {
                window.history.back();
              } else {
                // فحص ما إذا كان هذا ضغطة مزدوجة
                if (currentTime - lastBackPress <= DOUBLE_PRESS_DELAY) {
                  // تم اكتشاف ضغطة مزدوجة - تصغير التطبيق
                  CapacitorApp.minimizeApp();
                } else {
                  // الضغطة الأولى - تحديث الطابع الزمني
                  setLastBackPress(currentTime);
                  
                  // عرض إشعار يشير إلى أن ضغطة ثانية ستقوم بتصغير التطبيق
                  toast({
                    title: "اضغط مرة أخرى للخروج",
                    duration: 2000,
                  });
                }
              }
            } catch (backButtonError) {
              console.error("Error handling back button:", backButtonError);
              // محاولة الرجوع كخطة احتياطية
              try {
                window.history.back();
              } catch (navigateError) {
                console.error("Error navigating back:", navigateError);
              }
            }
          });
        }
      } catch (setupError) {
        console.error("Error setting up Capacitor:", setupError);
      }
    };
    
    setupCapacitor();
    
    return () => {
      try {
        if (window.Capacitor) {
          CapacitorApp.removeAllListeners();
        }
      } catch (cleanupError) {
        console.error("Error during Capacitor listeners cleanup:", cleanupError);
      }
    };
  }, [lastBackPress]);

  // وظيفة لإعادة محاولة الاتصال مع معالجة أخطاء محسنة
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

  // التحقق من حالة المصادقة
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // إذا كان هناك خطأ في الشبكة، عرض واجهة خطأ الشبكة
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
  
  // فرض صفحة تسجيل الدخول عندما لا تكون مصادقًا
  if (!isRestaurantLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<RestaurantLogin />} />
        <Route path="*" element={<Navigate to="/mobile/login" replace />} />
      </Routes>
    );
  }
  
  // إذا كنت مصادقًا ولا يوجد خطأ في الشبكة، عرض التطبيق الكامل
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
      
      <Route path="*" element={<Navigate to="/mobile/inventory" replace />} />
    </Routes>
  );
};

export default MobileApp;
