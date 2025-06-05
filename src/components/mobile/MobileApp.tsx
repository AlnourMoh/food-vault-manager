
import React, { useEffect } from 'react';
import { useBackButtonHandler } from '@/hooks/mobile/useBackButtonHandler';
import { useNetworkConnectionHandler } from '@/hooks/mobile/useNetworkConnectionHandler';
import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import NetworkErrorView from './NetworkErrorView';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

const MobileApp: React.FC = () => {
  // Use our custom hooks
  useBackButtonHandler();
  const { networkError, handleRetryConnection } = useNetworkConnectionHandler();
  
  // طلب إذن الكاميرا عند بدء تشغيل التطبيق
  useEffect(() => {
    const requestCameraPermissionOnStartup = async () => {
      try {
        console.log('MobileApp: التحقق من دعم الماسح ومحاولة طلب إذن الكاميرا عند بدء التطبيق');
        
        // التحقق أولاً من دعم الماسح على الجهاز
        const isSupported = await scannerPermissionService.isSupported();
        if (!isSupported) {
          console.log('MobileApp: الماسح غير مدعوم على هذا الجهاز');
          return;
        }
        
        // نطلب الإذن مباشرة بدلاً من التحقق منه فقط
        if (Capacitor.isNativePlatform()) {
          console.log('MobileApp: جاري طلب إذن الكاميرا عند بدء التطبيق مباشرة');
          
          // انتظار قصير لضمان تحميل التطبيق بشكل كامل
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
            duration: 'long'
          });
          
          // طلب الإذن مباشرة
          const granted = await scannerPermissionService.requestPermission();
          console.log('MobileApp: نتيجة طلب إذن الكاميرا عند بدء التطبيق:', granted);
          
          // محاولة طلب الإذن مرة أخرى بعد تأخير قصير إذا لم يتم منحه
          if (!granted) {
            setTimeout(async () => {
              await scannerPermissionService.requestPermission();
            }, 5000);
          }
        }
      } catch (error) {
        console.error('MobileApp: خطأ في طلب إذن الكاميرا عند بدء التطبيق:', error);
      }
    };
    
    // تنفيذ الدالة
    requestCameraPermissionOnStartup();
  }, []);
  
  // Check authentication state
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // If there's a network error, show network error view
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
  
  // Render authentication routes or main app routes based on login state
  return isRestaurantLoggedIn ? <AppRoutes /> : <AuthRoutes />;
};

export default MobileApp;
