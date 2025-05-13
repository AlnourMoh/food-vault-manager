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
  const [scanError, setScanError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { checkPermission, requestPermission, openAppSettings } = useScannerPermissions();
  const { fetchProductByCode, logProductScan } = useScanProduct();

  const handleOpenScanner = async () => {
    try {
      console.log('ProductScanLogic: فتح الماسح الضوئي');
      setScanError(null);
      setIsLoading(true);
      
      // التحقق إذا كنا في بيئة الويب وإعلام المستخدم
      if (!Capacitor.isNativePlatform()) {
        console.log('ProductScanLogic: بيئة الويب، عرض رسالة بدلاً من فتح الماسح');
        
        toast({
          title: "المسح غير متاح في المتصفح",
          description: "يرجى استخدام تطبيق الجوال للقيام بعمليات المسح",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return;
      }
      
      // في بيئة الأجهزة الجوالة، نتحقق من إذن الكاميرا ونفتح الماسح
      let permissionGranted = await checkPermission();
      
      if (!permissionGranted) {
        console.log('ProductScanLogic: طلب إذن الكاميرا');
        
        toast({
          title: "طلب إذن الكاميرا",
          description: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
        });
        
        permissionGranted = await requestPermission();
        
        if (!permissionGranted) {
          console.log('ProductScanLogic: تم رفض إذن الكاميرا');
          setScanError('تم رفض إذن الكاميرا، لا يمكن استخدام الماسح الضوئي');
          
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
      
      // فتح الماسح بمجرد حصولنا على الإذن اللازم
      console.log('ProductScanLogic: فتح الماسح الضوئي بعد التحقق من الإذن');
      setIsScannerOpen(true);
      
    } catch (error) {
      console.error('ProductScanLogic: خطأ في فتح الماسح:', error);
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
    handleCloseScanner: () => setIsScannerOpen(false),
    handleScanResult,
    handleScanAnother,
    viewProductDetails
  };
};
