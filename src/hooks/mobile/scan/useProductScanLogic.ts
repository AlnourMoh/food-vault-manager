
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { useScannerPermissions } from './useScannerPermissions';
import { useScanProduct } from './useScanProduct';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

export const useProductScanLogic = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { checkPermission, requestPermission, openAppSettings } = useScannerPermissions();
  const { fetchProductByCode, logProductScan } = useScanProduct();
  
  // فتح الماسح تلقائياً عند تحميل الصفحة
  useEffect(() => {
    if (!autoOpenAttempted) {
      console.log('ProductScan: فتح الماسح تلقائياً عند تحميل الصفحة');
      setAutoOpenAttempted(true);
      // تأخير قصير قبل فتح الماسح لضمان تحميل الصفحة بالكامل
      setTimeout(() => {
        handleOpenScanner();
      }, 1000);
    }
  }, []);

  const handleOpenScanner = async () => {
    try {
      console.log('ProductScan: فتح الماسح الضوئي');
      setScanError(null);
      setIsLoading(true);
      
      // في بيئة الويب، نفتح الماسح مباشرة بدون التحقق من الإذن
      // سيقوم المتصفح بطلب الإذن عند محاولة الوصول إلى الكاميرا
      if (!Capacitor.isNativePlatform()) {
        console.log('ProductScan: نحن في بيئة الويب، فتح الماسح مباشرة');
        setIsScannerOpen(true);
        setIsLoading(false);
        return;
      }
      
      // التحقق من إذن الكاميرا في الأجهزة الجوالة
      let permissionGranted = await checkPermission();
      
      if (!permissionGranted) {
        console.log('ProductScan: لا يوجد إذن للكاميرا، سيتم طلبه الآن');
        
        // إظهار إشعار للمستخدم
        toast({
          title: "طلب إذن الكاميرا",
          description: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
        });
        
        permissionGranted = await requestPermission();
        
        if (!permissionGranted) {
          console.log('ProductScan: تم رفض إذن الكاميرا');
          setScanError('تم رفض إذن الكاميرا، لا يمكن استخدام الماسح الضوئي');
          
          // محاولة إضافية من خلال فتح إعدادات التطبيق
          const openSettings = await openAppSettings();
          if (!openSettings) {
            toast({
              title: "تم رفض الإذن",
              description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك لاستخدام الماسح الضوئي",
              variant: "destructive",
            });
            
            setIsLoading(false);
            return;
          }
        }
      }
      
      // الآن بعد أن أصبح لدينا إذن، نفتح الماسح مباشرة
      console.log('ProductScan: فتح الماسح الضوئي مباشرة');
      setIsScannerOpen(true);
      
    } catch (error) {
      console.error('ProductScan: خطأ في فتح الماسح:', error);
      setScanError('حدث خطأ أثناء محاولة فتح الماسح الضوئي');
      
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة فتح الماسح الضوئي",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseScanner = () => {
    console.log('ProductScan: إغلاق الماسح');
    setIsScannerOpen(false);
  };

  const handleScanResult = async (code: string) => {
    console.log('ProductScan: تم استلام نتيجة المسح:', code);
    setIsLoading(true);
    setScanError(null);
    
    try {
      // Fetch product data using the helper function
      const product = await fetchProductByCode(code);
      
      if (product) {
        setScannedProduct(product);
        toast({
          title: "تم مسح المنتج بنجاح",
          description: `تم العثور على المنتج: ${product.name}`,
        });
      }
    } catch (error) {
      console.error('ProductScan: خطأ في البحث عن تفاصيل المنتج:', error);
      toast({
        title: "خطأ في البحث",
        description: typeof error === 'string' ? error : "حدث خطأ أثناء البحث عن معلومات المنتج",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // إغلاق الماسح بعد الانتهاء
      setIsScannerOpen(false);
    }
  };

  const handleScanAnother = () => {
    setScannedProduct(null);
    setScanError(null);
    // فتح الماسح مباشرة عند طلب مسح منتج آخر
    setIsScannerOpen(true);
  };

  const viewProductDetails = () => {
    if (scannedProduct?.id) {
      navigate(`/restaurant/products/${scannedProduct.id}`);
    }
  };

  return {
    isScannerOpen,
    scannedProduct,
    isLoading,
    scanError,
    handleOpenScanner,
    handleCloseScanner,
    handleScanResult,
    handleScanAnother,
    viewProductDetails
  };
};
