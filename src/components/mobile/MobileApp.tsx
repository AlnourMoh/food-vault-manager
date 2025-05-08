
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
        
        // التحقق من حالة الإذن الحالية
        const hasPermission = await scannerPermissionService.checkPermission();
        console.log('MobileApp: حالة إذن الكاميرا عند بدء التطبيق:', hasPermission);
        
        if (hasPermission) {
          console.log('MobileApp: إذن الكاميرا ممنوح بالفعل');
          return;
        }
        
        // طلب الإذن فقط إذا كنا في تطبيق جوال حقيقي (وليس في الويب)
        if (Capacitor.isNativePlatform()) {
          console.log('MobileApp: جاري طلب إذن الكاميرا عند بدء التطبيق');
          await Toast.show({
            text: 'التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود',
            duration: 'long'
          });
          
          // محاولة طلب الإذن
          const granted = await scannerPermissionService.requestPermission();
          console.log('MobileApp: نتيجة طلب إذن الكاميرا عند بدء التطبيق:', granted);
        }
      } catch (error) {
        console.error('MobileApp: خطأ في طلب إذن الكاميرا عند بدء التطبيق:', error);
      }
    };
    
    // تنفيذ الدالة بعد تأخير بسيط لضمان تحميل التطبيق أولاً
    const timer = setTimeout(requestCameraPermissionOnStartup, 1000);
    
    return () => clearTimeout(timer);
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
