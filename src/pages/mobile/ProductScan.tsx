
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner'; 
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import { Product } from '@/types';
import { Capacitor } from '@capacitor/core';

const ProductScan = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoOpenAttempted, setAutoOpenAttempted] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // فتح الماسح تلقائيًا عند تحميل الصفحة - مؤقت لعرض المحتوى أولاً
  useEffect(() => {
    if (!autoOpenAttempted && Capacitor.isNativePlatform()) {
      // نضع علامة أننا حاولنا الفتح التلقائي
      setAutoOpenAttempted(true);
      // فتح الماسح تلقائيًا بتأخير بسيط للسماح بتحميل الواجهة
      const timer = setTimeout(() => {
        console.log('محاولة فتح الماسح تلقائيًا...');
        setIsScannerOpen(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [autoOpenAttempted]);

  // تسجيل حالة الماسح للمساعدة في تشخيص المشكلة
  useEffect(() => {
    console.log('حالة الماسح:', { 
      isScannerOpen, 
      isLoading, 
      scanError, 
      autoOpenAttempted
    });
  }, [isScannerOpen, isLoading, scanError, autoOpenAttempted]);

  const handleOpenScanner = () => {
    console.log('فتح الماسح يدوياً');
    setScanError(null);
    setIsScannerOpen(true);
  };

  const handleCloseScanner = () => {
    console.log('إغلاق الماسح');
    setIsScannerOpen(false);
  };

  const handleScanResult = async (code: string) => {
    console.log('تم استلام نتيجة المسح:', code);
    setIsLoading(true);
    setScanError(null);
    
    try {
      console.log('جاري البحث عن بيانات المنتج للرمز:', code);
      const { data: productCode, error: codeError } = await supabase
        .from('product_codes')
        .select('product_id')
        .eq('qr_code', code)
        .single();
      
      if (codeError) {
        console.error('خطأ في البحث عن رمز المنتج:', codeError);
        setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
        throw codeError;
      }
      
      if (!productCode?.product_id) {
        console.error('لم يتم العثور على معرف المنتج للرمز:', code);
        setScanError('لم يتم العثور على معلومات المنتج لهذا الباركود');
        toast({
          title: "خطأ في الباركود",
          description: "لم يتم العثور على معلومات المنتج لهذا الباركود",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log('تم العثور على معرف المنتج:', productCode.product_id);
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productCode.product_id)
        .single();
      
      if (productError) {
        console.error('خطأ في البحث عن تفاصيل المنتج:', productError);
        setScanError('حدث خطأ أثناء جلب تفاصيل المنتج');
        throw productError;
      }
      
      console.log('تم جلب بيانات المنتج:', product);
      
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
            console.warn(`حالة منتج غير متوقعة: ${product.status}، استخدام 'active' كقيمة افتراضية`);
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
      console.log('بيانات المنتج المنسقة:', formattedProduct);
      
      const restaurantId = localStorage.getItem('restaurantId');
      if (restaurantId) {
        console.log('تسجيل عملية المسح للمطعم:', restaurantId);
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
      console.error('خطأ في البحث عن تفاصيل المنتج:', error);
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

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {scanError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex flex-col items-center">
          <p className="font-semibold mb-1">حدث خطأ أثناء المسح:</p>
          <p>{scanError}</p>
          <Button 
            onClick={handleOpenScanner}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800"
            size="sm"
          >
            إعادة المحاولة
          </Button>
        </div>
      )}
      
      {!scannedProduct ? (
        <InitialScanCard 
          onOpenScanner={handleOpenScanner}
          isLoading={isLoading}
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
        />
      )}
    </div>
  );
};

export default ProductScan;
