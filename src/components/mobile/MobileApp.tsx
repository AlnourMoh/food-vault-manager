
import React, { useEffect, useState } from 'react';
import { useBackButtonHandler } from '@/hooks/mobile/useBackButtonHandler';
import { useNetworkConnectionHandler } from '@/hooks/mobile/useNetworkConnectionHandler';
import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import NetworkErrorView from './NetworkErrorView';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { PermissionState } from '@capacitor/core';

const MobileApp: React.FC = () => {
  // Use our custom hooks
  useBackButtonHandler();
  const { networkError, handleRetryConnection } = useNetworkConnectionHandler();
  const [permissionRequested, setPermissionRequested] = useState(false);
  
  // طلب إذن الكاميرا عند بدء تشغيل التطبيق بعدة طرق
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        console.log('MobileApp: بدء تشغيل التطبيق ومحاولة طلب إذن الكاميرا');
        
        // التحقق مما إذا كنا في بيئة تطبيق أصلي
        if (!Capacitor.isNativePlatform()) {
          console.log('MobileApp: لسنا في بيئة تطبيق أصلي');
          return;
        }
        
        // عرض رسالة للمستخدم
        await Toast.show({
          text: 'جاري التحقق من أذونات الكاميرا...',
          duration: 'short'
        });
        
        // التحقق من حالة الإذن الحالية
        let hasPermission = false;
        
        // الطريقة 1: استخدام BarcodeScanner إذا كان متاحًا
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('MobileApp: التحقق باستخدام MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          console.log('MobileApp: حالة إذن BarcodeScanner:', status);
          
          hasPermission = status.camera === 'granted';
          
          if (!hasPermission) {
            // طلب الإذن مباشرة
            await Toast.show({
              text: 'التطبيق بحاجة لإذن الكاميرا لمسح الباركود',
              duration: 'long'
            });
            
            console.log('MobileApp: طلب إذن BarcodeScanner');
            const result = await BarcodeScanner.requestPermissions();
            console.log('MobileApp: نتيجة طلب إذن BarcodeScanner:', result);
            
            hasPermission = result.camera === 'granted';
            
            // إذا لم يتم منح الإذن، نفتح الإعدادات
            if (!hasPermission && result.camera === 'denied') {
              await Toast.show({
                text: 'تم رفض إذن الكاميرا. سنحاول فتح إعدادات التطبيق',
                duration: 'long'
              });
              
              const appId = 'app.lovable.foodvault.manager';
              if (Capacitor.getPlatform() === 'android') {
                // محاولة فتح إعدادات الأندرويد باستخدام App.openUrl
                try {
                  await App.openUrl({ url: `package:${appId}` });
                } catch (e) {
                  console.error('MobileApp: خطأ في فتح إعدادات التطبيق:', e);
                  await Toast.show({
                    text: 'يرجى فتح إعدادات التطبيق يدويًا وتمكين إذن الكاميرا',
                    duration: 'long'
                  });
                }
              }
            }
          }
        }
        
        // تحديث حالة طلب الإذن
        setPermissionRequested(true);
        
      } catch (error) {
        console.error('MobileApp: خطأ في طلب إذن الكاميرا:', error);
        
        // عرض رسالة خطأ للمستخدم
        try {
          await Toast.show({
            text: 'حدث خطأ أثناء طلب إذن الكاميرا',
            duration: 'long'
          });
        } catch (e) {
          console.error('MobileApp: خطأ في عرض رسالة Toast:', e);
        }
      }
    };
    
    // تنفيذ طلب الإذن بعد تأخير قصير لضمان تهيئة المكونات
    const timer = setTimeout(() => {
      if (!permissionRequested) {
        requestCameraPermission();
      }
    }, 1000);
    
    // تنظيف المؤقت عند إزالة المكون
    return () => clearTimeout(timer);
  }, [permissionRequested]);
  
  // تسجيل مستمع حدث تغيير حالة التطبيق
  useEffect(() => {
    console.log('MobileApp: تسجيل مستمع لتغيير حالة التطبيق');
    
    const appStateChangeListener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        console.log('MobileApp: التطبيق نشط، فحص أذونات الكاميرا');
        // فحص الأذونات عند استعادة التطبيق للنشاط
        scannerPermissionService.checkPermission()
          .then(hasPermission => {
            console.log('MobileApp: حالة إذن الكاميرا عند استعادة النشاط:', hasPermission);
          })
          .catch(error => {
            console.error('MobileApp: خطأ في فحص إذن الكاميرا عند استعادة النشاط:', error);
          });
      }
    });
    
    // تنظيف المستمع عند إزالة المكون
    return () => {
      appStateChangeListener.remove();
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
