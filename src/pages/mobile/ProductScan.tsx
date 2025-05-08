
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner'; 
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import { Product } from '@/types';
import { Capacitor } from '@capacitor/core';
import { Button } from '@/components/ui/button';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Camera, Lock } from 'lucide-react';
import { Toast } from '@capacitor/toast';

const ProductScan = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // التحقق من إذن الكاميرا عند تحميل الصفحة
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        setIsCheckingPermission(true);
        console.log('ProductScan: التحقق من إذن الكاميرا...');
        
        const permissionGranted = await scannerPermissionService.checkPermission();
        console.log('ProductScan: نتيجة التحقق من إذن الكاميرا:', permissionGranted);
        
        setHasPermission(permissionGranted);
        
        // فتح الماسح تلقائياً إذا كان لدينا إذن وكنا على منصة جوال
        if (permissionGranted && Capacitor.isNativePlatform() && !autoOpenAttempted) {
          console.log('ProductScan: لدينا إذن، سيتم محاولة فتح الماسح تلقائياً...');
          setAutoOpenAttempted(true);
          
          // إضافة تأخير بسيط لضمان تحميل الواجهة أولاً
          setTimeout(() => {
            setIsScannerOpen(true);
          }, 800);
        }
      } catch (error) {
        console.error('ProductScan: خطأ في التحقق من إذن الكاميرا:', error);
      } finally {
        setIsCheckingPermission(false);
      }
    };
    
    checkCameraPermission();
  }, [autoOpenAttempted]);

  // تسجيل حالة الماسح للمساعدة في تشخيص المشكلة
  useEffect(() => {
    console.log('ProductScan: حالة الماسح:', { 
      isScannerOpen, 
      isLoading, 
      scanError, 
      autoOpenAttempted,
      hasPermission,
      isCheckingPermission
    });
  }, [isScannerOpen, isLoading, scanError, autoOpenAttempted, hasPermission, isCheckingPermission]);

  const handleOpenScanner = async () => {
    try {
      console.log('ProductScan: فتح الماسح يدوياً');
      setScanError(null);
      setIsLoading(true);
      
      // التحقق من إذن الكاميرا وطلبه إذا لم يكن ممنوحاً
      const permissionGranted = await scannerPermissionService.checkPermission();
      
      if (!permissionGranted) {
        console.log('ProductScan: لا يوجد إذن للكاميرا، سيتم طلبه الآن');
        
        // إظهار إشعار للمستخدم
        toast({
          title: "طلب إذن الكاميرا",
          description: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
        });
        
        const granted = await scannerPermissionService.requestPermission();
        setHasPermission(granted);
        
        if (!granted) {
          console.log('ProductScan: تم رفض إذن الكاميرا');
          setScanError('تم رفض إذن الكاميرا، لا يمكن استخدام الماسح الضوئي');
          
          toast({
            title: "تم رفض الإذن",
            description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك لاستخدام الماسح الضوئي",
            variant: "destructive",
          });
          
          setIsLoading(false);
          return;
        }
      }
      
      // الآن بعد أن أصبح لدينا إذن، نفتح الماسح
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
  
  const handleRequestPermission = async () => {
    try {
      console.log('ProductScan: طلب إذن الكاميرا يدوياً');
      setIsLoading(true);
      
      // إعادة تعيين الذاكرة المخزنة مؤقتاً للإذن
      scannerPermissionService.resetPermissionCache();
      
      // طلب الإذن
      const granted = await scannerPermissionService.requestPermission();
      setHasPermission(granted);
      
      // عرض نتيجة طلب الإذن
      if (granted) {
        console.log('ProductScan: تم منح إذن الكاميرا بنجاح');
        setScanError(null);
        
        toast({
          title: "تم منح الإذن",
          description: "تم منح إذن الكاميرا بنجاح، يمكنك الآن استخدام الماسح الضوئي",
        });
        
        // بعد الحصول على الإذن، نحاول فتح الماسح تلقائياً
        setTimeout(() => {
          setIsScannerOpen(true);
        }, 500);
      } else {
        console.log('ProductScan: لم يتم منح إذن الكاميرا');
        setScanError('تم رفض إذن الكاميرا، لا يمكن استخدام الماسح الضوئي');
        
        toast({
          title: "تم رفض الإذن",
          description: "يرجى تمكين إذن الكاميرا من إعدادات جهازك لاستخدام الماسح الضوئي",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('ProductScan: خطأ في طلب إذن الكاميرا:', error);
      setScanError('حدث خطأ أثناء محاولة طلب إذن الكاميرا');
      
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenSettings = async () => {
    try {
      console.log('ProductScan: فتح إعدادات التطبيق');
      setIsLoading(true);
      
      await scannerPermissionService.openAppSettings();
      
      // إعادة التحقق من الإذن بعد فترة قصيرة
      setTimeout(async () => {
        const granted = await scannerPermissionService.checkPermission();
        setHasPermission(granted);
        setIsLoading(false);
        
        if (granted) {
          setScanError(null);
          toast({
            title: "تم منح الإذن",
            description: "تم منح إذن الكاميرا بنجاح، يمكنك الآن استخدام الماسح الضوئي",
          });
        }
      }, 3000);
    } catch (error) {
      console.error('ProductScan: خطأ في فتح إعدادات التطبيق:', error);
      setIsLoading(false);
      
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة فتح إعدادات التطبيق",
        variant: "destructive",
      });
    }
  };

  const handleScanResult = async (code: string) => {
    console.log('ProductScan: تم استلام نتيجة المسح:', code);
    setIsLoading(true);
    setScanError(null);
    
    try {
      console.log('ProductScan: جاري البحث عن بيانات المنتج للرمز:', code);
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .single();
      
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
        setIsLoading(false);
        return;
      }
      
      console.log('ProductScan: تم العثور على معرف المنتج:', productCode.product_id);
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .single();
      
      if (productError) {
        console.error('ProductScan: خطأ في البحث عن تفاصيل المنتج:', productError);
        setScanError('حدث خطأ أثناء جلب تفاصيل المنتج');
        throw productError;
      }
      
      console.log('ProductScan: تم جلب بيانات المنتج:', product);
      
      // تحويل بيانات المنتج من قاعدة البيانات إلى تنسيق واجهة المنتج
      // التأكد من أن قيمة الحالة تتطابق مع النوع المتوقع
      const normalizedStatus = ((): 'active' | 'expired' | 'removed' => {
        switch(product.status) {
          case 'active':
            return 'active';
          case 'expired':
            return 'expired';
          case 'removed':
            return 'removed';
          default:
            // القيمة الافتراضية "active" إذا كانت الحالة لا تتطابق مع أي من القيم المتوقعة
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
        restaurantName: '', // هذه المعلومة غير متوفرة من الاستعلام
        addedBy: '', // هذه المعلومة غير متوفرة من الاستعلام
        status: normalizedStatus,
        imageUrl: product.image_url,
      };
      
      setScannedProduct(formattedProduct);
      console.log('ProductScan: بيانات المنتج المنسقة:', formattedProduct);
      
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId) {
        console.log('ProductScan: تسجيل عملية المسح للمطعم:', restaurantId);
        await supabase
          .from('product_scans')
          .insert({
            product_id: product.id,
            qr_code: code,
            scan_type: 'check',
            scanned_by: restaurantId
          });
      }
      
      toast({
        title: "تم مسح المنتج بنجاح",
        description: `تم العثور على المنتج: ${product.name}`,
      });
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
  
  // عرض قسم طلب الإذن إذا لم يكن لدينا إذن للكاميرا
  const renderPermissionSection = () => {
    if (hasPermission === false) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-red-100 rounded-full mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-semibold mb-1">لا يوجد إذن للكاميرا</h3>
            <p className="text-sm text-center mb-3">
              يحتاج التطبيق إلى إذن الكاميرا لكي يتمكن من مسح الباركود
            </p>
            <div className="flex flex-col w-full gap-2">
              <Button 
                onClick={handleRequestPermission}
                className="w-full"
                disabled={isLoading}
              >
                <Camera className="h-4 w-4 ml-2" />
                طلب إذن الكاميرا
              </Button>
              <Button 
                onClick={handleOpenSettings}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                فتح إعدادات التطبيق
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {renderPermissionSection()}
      
      {scanError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex flex-col items-center">
          <p className="font-semibold mb-1">حدث خطأ أثناء المسح:</p>
          <p>{scanError}</p>
          <Button 
            onClick={handleOpenScanner}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800"
            size="sm"
            disabled={hasPermission === false || isLoading}
          >
            إعادة المحاولة
          </Button>
        </div>
      )}
      
      {!scannedProduct ? (
        <InitialScanCard 
          onOpenScanner={handleOpenScanner}
          isLoading={isLoading || isCheckingPermission}
          hasPermission={hasPermission}
        />
      ) : (
        <ScannedProductCard
          product={scannedProduct}
          onScanAnother={handleScanAnother}
          onViewDetails={viewProductDetails}
        />
      )}
      
      {isScannerOpen && (
        <ZXingBarcodeScanner
          onScan={handleScanResult}
          onClose={handleCloseScanner}
          autoStart={true}
        />
      )}
    </div>
  );
};

export default ProductScan;
