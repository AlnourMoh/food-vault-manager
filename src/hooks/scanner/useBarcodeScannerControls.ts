
import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { PlatformService } from '@/services/scanner/PlatformService';

/**
 * هوك للتحكم في الماسح الضوئي
 */
export const useBarcodeScannerControls = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasScannerError, setHasScannerError] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  
  /**
   * التحقق من بيئة العمل عند التحميل
   */
  useEffect(() => {
    // تحديد ما إذا كانت البيئة أصلية أم لا
    const native = Capacitor.isNativePlatform();
    setIsNativePlatform(native);
    
    // تطبيق أنماط مخصصة على عناصر واجهة المستخدم
    document.documentElement.style.setProperty('--is-native', native ? '1' : '0');
    
    console.log('[useBarcodeScannerControls] هل البيئة أصلية؟', native);
    console.log('[useBarcodeScannerControls] المنصة:', Capacitor.getPlatform());
  }, []);
  
  /**
   * إعداد واجهة المستخدم للمسح
   */
  const setupScannerUI = useCallback(async () => {
    try {
      // إضافة فئة للجسم للتحكم في المظهر العام
      document.body.classList.add('scanner-active');
      
      // إخفاء العناصر التي قد تتداخل مع المسح
      document.querySelectorAll('header:not(.scanner-header), footer:not(.scanner-footer), nav:not(.scanner-nav)').forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.opacity = '0';
          element.style.visibility = 'hidden';
          element.style.background = 'transparent';
        }
      });
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScannerControls] خطأ في إعداد واجهة المستخدم للمسح:', error);
      return false;
    }
  }, []);
  
  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  const restoreScannerUI = useCallback(async () => {
    try {
      // إزالة فئة الجسم
      document.body.classList.remove('scanner-active');
      
      // إعادة إظهار العناصر المخفية
      document.querySelectorAll('header, footer, nav').forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.opacity = '';
          element.style.visibility = '';
          element.style.background = '';
        }
      });
      
      // تطبيق أنماط محددة على العناصر الرئيسية
      document.querySelectorAll('.app-header, .app-footer').forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.background = 'white';
          el.style.backgroundColor = 'white';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
        }
      });
      
      return true;
    } catch (error) {
      console.error('[useBarcodeScannerControls] خطأ في استعادة واجهة المستخدم بعد المسح:', error);
      return false;
    }
  }, []);
  
  /**
   * تنظيف الماسح عند إلغاء التحميل
   */
  useEffect(() => {
    return () => {
      // استعادة واجهة المستخدم عند إلغاء تحميل المكوّن
      restoreScannerUI();
    };
  }, [restoreScannerUI]);

  return {
    isScanning,
    setIsScanning,
    hasPermission,
    setHasPermission,
    hasScannerError,
    setHasScannerError,
    isScanningActive,
    setIsScanningActive,
    lastScannedCode,
    setLastScannedCode,
    isManualEntry,
    setIsManualEntry,
    isNativePlatform,
    setupScannerUI,
    restoreScannerUI
  };
};
