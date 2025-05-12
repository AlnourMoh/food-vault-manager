
import React, { useEffect } from 'react';
import { useBackButtonHandler } from '@/hooks/mobile/useBackButtonHandler';
import { useNetworkConnectionHandler } from '@/hooks/mobile/useNetworkConnectionHandler';
import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import NetworkErrorView from './NetworkErrorView';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { App } from '@capacitor/app';

const MobileApp: React.FC = () => {
  // Use our custom hooks
  useBackButtonHandler();
  const { networkError, handleRetryConnection } = useNetworkConnectionHandler();
  
  // طلب إذن الكاميرا عند بدء تشغيل التطبيق
  useEffect(() => {
    const requestCameraPermissionOnStartup = async () => {
      try {
        console.log('MobileApp: محاولة طلب إذن الكاميرا عند بدء التطبيق');
        
        // انتظار قصير لضمان تحميل التطبيق بشكل كامل
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // عرض رسالة للمستخدم
        await Toast.show({
          text: 'التطبيق يحتاج إلى إذن الكاميرا للعمل بشكل سليم',
          duration: 'long'
        });
        
        // محاولة أولى: استخدام BarcodeScanner
        if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('MobileApp: طلب إذن الكاميرا باستخدام BarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          
          if (status.camera !== 'granted') {
            console.log('MobileApp: طلب إذن الكاميرا عبر BarcodeScanner');
            const result = await BarcodeScanner.requestPermissions();
            console.log('MobileApp: نتيجة طلب الإذن:', result);
          }
        }
        
        // محاولة ثانية: استخدام Camera API
        if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Camera')) {
          console.log('MobileApp: طلب إذن الكاميرا باستخدام Camera API');
          const status = await Camera.checkPermissions();
          
          if (status.camera !== 'granted') {
            console.log('MobileApp: طلب إذن الكاميرا عبر Camera API');
            const result = await Camera.requestPermissions({ permissions: ['camera'] });
            console.log('MobileApp: نتيجة طلب الإذن:', result);
            
            // محاولة فتح الكاميرا لتفعيل طلب الإذن بشكل أكيد
            if (result.camera === 'granted') {
              try {
                await Camera.getPhoto({
                  quality: 30,
                  allowEditing: false,
                  resultType: 'uri'
                });
              } catch (e) {
                console.log('MobileApp: تم إلغاء التقاط الصورة:', e);
              }
            }
          }
        }
        
        // محاولة استخدام scannerPermissionService كاحتياطي
        const hasPermission = await scannerPermissionService.checkPermission();
        if (!hasPermission) {
          console.log('MobileApp: طلب الإذن باستخدام scannerPermissionService');
          await scannerPermissionService.requestPermission();
        }
        
      } catch (error) {
        console.error('MobileApp: خطأ في طلب إذن الكاميرا عند بدء التطبيق:', error);
      }
    };
    
    // تسجيل مستمع لحدث استئناف التطبيق
    const setupAppListeners = () => {
      App.addListener('resume', async () => {
        console.log('MobileApp: التطبيق تمت استعادته، التحقق من أذونات الكاميرا');
        await requestCameraPermissionOnStartup();
      });
    };
    
    // تنفيذ الدالات
    if (Capacitor.isNativePlatform()) {
      setupAppListeners();
      requestCameraPermissionOnStartup();
    }
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
      }
    };
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
