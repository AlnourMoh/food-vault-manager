
import { useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { useToast } from '@/hooks/use-toast';

/**
 * هوك للتعامل مع أذونات الكاميرا في Capacitor
 */
export const useCapacitorPermission = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  /**
   * التحقق من دعم الماسح
   */
  const checkSupport = useCallback(async (): Promise<boolean> => {
    try {
      if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        return false;
      }
      
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch (error) {
      console.error('خطأ في التحقق من دعم الماسح:', error);
      return false;
    }
  }, []);

  /**
   * التحقق من إذن الكاميرا
   */
  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ملحق MLKitBarcodeScanner غير متاح');
        setHasPermission(false);
        return false;
      }
      
      const status = await BarcodeScanner.checkPermissions();
      const granted = status.camera === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('خطأ في التحقق من إذن الكاميرا:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * طلب إذن الكاميرا
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('ملحق MLKitBarcodeScanner غير متاح');
        setHasPermission(false);
        return false;
      }
      
      const status = await BarcodeScanner.requestPermissions();
      const granted = status.camera === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        toast({
          title: "تم رفض إذن الكاميرا",
          description: "يجب منح إذن الكاميرا لاستخدام الماسح الضوئي",
          variant: "destructive"
        });
      }
      
      return granted;
    } catch (error) {
      console.error('خطأ في طلب إذن الكاميرا:', error);
      setHasPermission(false);
      
      toast({
        title: "خطأ في طلب إذن الكاميرا",
        description: "حدث خطأ أثناء محاولة طلب إذن الكاميرا",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * التحقق من الدعم والإذن
   */
  const checkSupportAndPermission = useCallback(async (): Promise<boolean> => {
    try {
      const isSupported = await checkSupport();
      if (!isSupported) {
        setHasPermission(false);
        return false;
      }
      
      return await checkPermission();
    } catch (error) {
      console.error('خطأ في التحقق من الدعم والإذن:', error);
      setHasPermission(false);
      return false;
    }
  }, [checkSupport, checkPermission]);

  /**
   * فتح إعدادات التطبيق
   */
  const openSettings = useCallback(async (): Promise<void> => {
    if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
      await BarcodeScanner.openSettings();
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    checkPermission,
    requestPermission,
    checkSupportAndPermission,
    openSettings
  };
};
