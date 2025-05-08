import React, { useEffect, useRef, useState } from 'react';
import { useZXingScanner } from '@/hooks/scanner/useZXingScanner';
import { ScannerContainer } from './scanner/ScannerContainer';
import { Toast } from '@capacitor/toast';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import '@/styles/zxing-scanner.css';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface ZXingBarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const ZXingBarcodeScanner: React.FC<ZXingBarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // استخدام hook الماسح الضوئي مع طلب الأذونات المباشر
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    isManualEntry,
    hasScannerError,
    startScan,
    stopScan,
    requestPermission,
    handleManualEntry,
    handleManualCancel,
    handleRetry
  } = useZXingScanner({ onScan, onClose });
  
  // تهيئة المكون مع طلب الأذونات إن لم تكن موجودة
  useEffect(() => {
    console.log('[ZXingBarcodeScanner] تهيئة المكون');
    
    // إضافة التأثير البصري للماسح
    document.body.classList.add('zxing-scanning');
    
    // التحقق من الإذن وطلبه إذا لم يكن موجوداً
    const setupScanner = async () => {
      try {
        setIsInitializing(true);
        
        // محاولة إعادة تعيين حالة التطبيق المسجلة في Android
        if (Capacitor.getPlatform() === 'android') {
          try {
            await BarcodeScanner.enableTorch(false);
          } catch (e) {
            // تجاهل الأخطاء هنا
          }
          
          try {
            await BarcodeScanner.stopScan();
          } catch (e) {
            // تجاهل الأخطاء هنا
          }
        }
        
        // طلب الإذن مباشرة عند تحميل المكون بطرق متعددة
        console.log('[ZXingBarcodeScanner] محاولة طلب إذن الكاميرا...');
        
        // التحقق المباشر عبر MLKit مع إظهار شاشة توضيحية
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ZXingBarcodeScanner] التحقق من وجود MLKit...');
          
          // إعادة تعيين حالة الإذن
          try {
            // التحقق من حالة الإذن الحالية
            const { camera } = await BarcodeScanner.checkPermissions();
            console.log('[ZXingBarcodeScanner] حالة إذن الكاميرا:', camera);
            
            if (camera === 'granted') {
              console.log('[ZXingBarcodeScanner] الإذن ممنوح مسبقاً، بدء المسح');
              startScan();
              setIsInitializing(false);
              return;
            }
            
            if (camera === 'prompt' || camera === 'prompt-with-rationale') {
              // طلب الإذن مباشرة من MLKit
              console.log('[ZXingBarcodeScanner] طلب الإذن مباشرة من MLKit');
              
              await Toast.show({
                text: 'التطبيق يحتاج للوصول إلى الكاميرا، الرجاء السماح له',
                duration: 'long'
              });
              
              setTimeout(async () => {
                const permissionResult = await BarcodeScanner.requestPermissions();
                console.log('[ZXingBarcodeScanner] نتيجة طلب الإذن من MLKit:', permissionResult);
                
                if (permissionResult.camera === 'granted') {
                  console.log('[ZXingBarcodeScanner] تم منح الإذن من MLKit، بدء المسح');
                  await Toast.show({
                    text: 'تم منح إذن الكاميرا بنجاح! جاري بدء المسح',
                    duration: 'short'
                  });
                  startScan();
                  setIsInitializing(false);
                  return;
                } else {
                  // طريقة بديلة إذا فشل MLKit
                  console.log('[ZXingBarcodeScanner] فشل طلب الإذن من MLKit، جاري استخدام الطريقة البديلة');
                  const granted = await requestPermission();
                  
                  if (!granted) {
                    // محاولة استخدام scannerPermissionService كخيار أخير
                    const serviceGranted = await scannerPermissionService.requestPermission();
                    if (!serviceGranted) {
                      await Toast.show({
                        text: 'لم يتم منح إذن الكاميرا. برجاء تمكينه من إعدادات الهاتف.',
                        duration: 'long'
                      });
                      
                      setTimeout(async () => {
                        // Fix: Remove the argument
                        await scannerPermissionService.openAppSettings();
                      }, 1500);
                    }
                  }
                  setIsInitializing(false);
                }
              }, 500); // تأخير صغير لضمان ظهور رسالة التوضيح قبل طلب الإذن
              return;
            }
            
            if (camera === 'denied') {
              console.log('[ZXingBarcodeScanner] تم رفض الإذن سابقًا، محاولة استخدام الطريقة البديلة');
              await Toast.show({
                text: 'تم رفض إذن الكاميرا سابقًا. برجاء تمكينه من إعدادات التطبيق.',
                duration: 'long'
              });
              
              setTimeout(async () => {
                // Fix: Remove the argument
                await scannerPermissionService.openAppSettings();
              }, 1500);
              
              setIsInitializing(false);
              return;
            }
          } catch (e) {
            console.error('[ZXingBarcodeScanner] خطأ في التحقق من إذن MLKit:', e);
          }
        }
        
        // اختبار إذا كان الإذن موجود مسبقًا عبر الخدمة
        const permissionStatus = await scannerPermissionService.checkPermission();
        
        if (permissionStatus) {
          console.log('[ZXingBarcodeScanner] إذن الكاميرا موجود مسبقًا، بدء المسح...');
          startScan();
          setIsInitializing(false);
          return;
        }
        
        // عرض رسالة توضيحية للمستخدم
        await Toast.show({
          text: 'المطلوب إذن الكاميرا لمسح الباركود',
          duration: 'short'
        });
        
        // محاولة طلب الإذن بأكثر من طريقة
        const granted = await requestPermission();
        
        if (!granted) {
          console.log('[ZXingBarcodeScanner] لم يتم منح الإذن، محاولة مع تفعيل وضع القوة...');
          
          // محاولة ثانية مع إظهار رسالة توضيحية إضافية
          await Toast.show({
            text: 'يرجى السماح بالوصول للكاميرا لاستخدام الماسح الضوئي',
            duration: 'long'
          });
          
          // يمكننا محاولة طلب الإذن مباشرةً من الخدمة
          const serviceGranted = await scannerPermissionService.requestPermission();
          
          if (!serviceGranted) {
            console.log('[ZXingBarcodeScanner] لم يتم منح الإذن حتى بعد المحاولة الثانية');
            
            // بعض الأجهزة تحتاج لإعادة تشغيل التطبيق لتطبيق الإذن
            await Toast.show({
              text: 'قد تحتاج إلى إعادة تشغيل التطبيق بعد منح الإذن',
              duration: 'short'
            });
            
            // عرض رسالة توضيحية للمستخدم حول كيفية تمكين الإذن يدويًا
            const platform = Capacitor.getPlatform();
            const settingsMessage = platform === 'ios' 
              ? 'افتح الإعدادات > الخصوصية > الكاميرا وقم بالسماح للتطبيق'
              : 'افتح الإعدادات > التطبيقات > مخزن الطعام > الأذونات وقم بتمكين الكاميرا';
              
            await Toast.show({
              text: `لم يتم منح إذن الكاميرا. ${settingsMessage}`,
              duration: 'long'
            });
            
            // محاولة فتح إعدادات التطبيق
            setTimeout(() => {
              try {
                // Fix: Remove the argument
                scannerPermissionService.openAppSettings();
              } catch (e) {
                console.error('[ZXingBarcodeScanner] خطأ في فتح الإعدادات:', e);
              }
            }, 1500);
            
            setIsInitializing(false);
            return;
          }
        }
        
        // بدء المسح إذا كان لدينا إذن
        console.log('[ZXingBarcodeScanner] تم منح الإذن، محاولة بدء المسح...');
        startScan().catch(e => 
          console.error('[ZXingBarcodeScanner] خطأ في بدء المسح:', e)
        );
      } catch (error) {
        console.error('[ZXingBarcodeScanner] خطأ في إعداد الماسح:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    setupScanner();
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      console.log('[ZXingBarcodeScanner] تنظيف المكون');
      
      // إزالة التأثير البصري
      document.body.classList.remove('zxing-scanning');
      
      stopScan().catch(e => 
        console.error('[ZXingBarcodeScanner] خطأ في إيقاف المسح عند التنظيف:', e)
      );
    };
  }, [hasPermission, startScan, stopScan, requestPermission]);

  return (
    <div 
      ref={scannerContainerRef}
      className="fixed inset-0 z-[9999] scanner-container" 
      style={{
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
      data-testid="zxing-barcode-scanner"
    >
      <ScannerContainer
        isManualEntry={isManualEntry}
        hasScannerError={hasScannerError}
        isLoading={isLoading || isInitializing}
        hasPermission={hasPermission}
        isScanningActive={isScanningActive}
        lastScannedCode={lastScannedCode}
        onScan={onScan}
        onClose={onClose}
        startScan={startScan}
        stopScan={stopScan}
        handleManualEntry={handleManualEntry}
        handleManualCancel={handleManualCancel}
        handleRequestPermission={requestPermission}
        handleRetry={handleRetry}
      />
    </div>
  );
};

export default ZXingBarcodeScanner;
