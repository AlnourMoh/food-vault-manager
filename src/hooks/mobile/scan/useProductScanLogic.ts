
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Capacitor } from '@capacitor/core';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';

export const useProductScanLogic = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      let permissionGranted = await scannerPermissionService.checkPermission();
      
      if (!permissionGranted) {
        console.log('ProductScan: لا يوجد إذن للكاميرا، سيتم طلبه الآن');
        
        // إظهار إشعار للمستخدم
        toast({
          title: "طلب إذن الكاميرا",
          description: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
        });
        
        permissionGranted = await scannerPermissionService.requestPermission();
        
        if (!permissionGranted) {
          console.log('ProductScan: تم رفض إذن الكاميرا');
          setScanError('تم رفض إذن الكاميرا، لا يمكن استخدام الماسح الضوئي');
          
          // محاولة إضافية من خلال فتح إعدادات التطبيق
          const openSettings = await scannerPermissionService.openAppSettings();
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
        description: scanError || "حدث خطأ أثناء البحث عن معلومات المنتج",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      // إغلاق الماسح بعد الانتهاء
      setIsScannerOpen(false);
    }
  };

  const fetchProductByCode = async (code: string): Promise<Product | null> => {
    console.log('ProductScan: جاري البحث عن بيانات المنتج للرمز:', code);
    const { data: productCode, error: codeError } = await supabase
      .from('product_codes')
      .select('product_id')
      .eq('qr_code', code)
      .maybeSingle();
    
    if (codeError) {
      console.error('ProductScan: خطأ في البحث عن رمز المنتج:', codeError);
      setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
      throw codeError;
    }
    
    if (!productCode?.product_id) {
      console.error('ProductScan: لم يتم العثور على معرف المنتج للرمز:', code);
      setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
      toast({
        title: "خطأ في الباركود",
        description: "لم يتم العثور على معلومات المنتج لهذا الباركود",
        variant: "destructive"
      });
      return null;
    }
    
    console.log('ProductScan: تم العثور على معرف المنتج:', productCode.product_id);
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productCode.product_id)
      .maybeSingle();
    
    if (productError) {
      console.error('ProductScan: خطأ في البحث عن تفاصيل المنتج:', productError);
      setScanError('حدث خطأ أثناء جلب تفاصيل المنتج');
      throw productError;
    }
    
    if (!product) {
      console.error('ProductScan: لم يتم العثور على بيانات المنتج:', productCode.product_id);
      setScanError('لم يتم العثور على بيانات المنتج');
      toast({
        title: "خطأ في البحث",
        description: "لم يتم العثور على بيانات المنتج المطلوب",
        variant: "destructive"
      });
      return null;
    }
    
    console.log('ProductScan: تم جلب بيانات المنتج:', product);
    
    // تحويل بيانات المنتج من قاعدة البيانات إلى تنسيق واجهة المنتج
    const normalizedStatus = ((): 'active' | 'expired' | 'removed' => {
      switch(product.status) {
        case 'active':
          return 'active';
        case 'expired':
          return 'expired';
        case 'removed':
          return 'removed';
        default:
          console.warn(`ProductScan: حالة منتج غير متوقعة: ${product.status}، استخدام 'active' كقيمة افتراضية`);
          return 'active';
      }
    })();
    
    const formattedProduct: Product = {
      id: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit || '',
      quantity: product.quantity,
      expiryDate: new Date(product.expiry_date),
      entryDate: new Date(product.production_date),
      restaurantId: product.company_id,
      restaurantName: '', 
      addedBy: '', 
      status: normalizedStatus,
      imageUrl: product.image_url,
    };
    
    console.log('ProductScan: بيانات المنتج المنسقة:', formattedProduct);
    
    // Log scan in database
    await logProductScan(code, product.id);
    
    return formattedProduct;
  };

  const logProductScan = async (code: string, productId: string) => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (restaurantId) {
      console.log('ProductScan: تسجيل عملية المسح للمطعم:', restaurantId);
      await supabase
        .from('product_scans')
        .insert({
          product_id: productId,
          qr_code: code,
          scan_type: 'check',
          scanned_by: restaurantId
        });
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
