
import { useState, useCallback } from 'react';
import { zxingService } from '@/services/scanner/ZXingService';
import { useToast } from '@/hooks/use-toast';

/**
 * هوك للتعامل مع أذونات الكاميرا
 */
export const useScannerPermission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  /**
   * طلب إذن الكاميرا
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const permissionStatus = await zxingService.requestPermission();
      
      setHasPermission(permissionStatus.granted);
      
      if (!permissionStatus.granted && permissionStatus.error) {
        toast({
          title: "لم يتم الحصول على إذن الكاميرا",
          description: permissionStatus.error,
          variant: "destructive"
        });
      }
      
      return permissionStatus.granted;
    } catch (error) {
      console.error('[useScannerPermission] خطأ في طلب الإذن:', error);
      
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
   * التحقق من دعم الجهاز والأذونات
   */
  const checkSupportAndPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // التحقق أولاً من الدعم
      const isSupported = await zxingService.isSupported();
      if (!isSupported) {
        setHasPermission(false);
        return false;
      }
      
      // التحقق من الإذن
      const permissionStatus = await zxingService.requestPermission();
      setHasPermission(permissionStatus.granted);
      
      return permissionStatus.granted;
    } catch (error) {
      console.error('[useScannerPermission] خطأ في التحقق من الدعم والإذن:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    requestPermission,
    checkSupportAndPermission
  };
};
