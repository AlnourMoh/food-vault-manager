
import React, { useEffect } from 'react';
import { useProductScanLogic } from '@/hooks/mobile/scan/useProductScanLogic';
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ErrorDisplay } from '@/components/mobile/scanner/product/ErrorDisplay';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { BrowserView } from '@/components/mobile/scanner/components/BrowserView';
import { useNavigate } from 'react-router-dom';

const ProductScan = () => {
  const navigate = useNavigate();
  const {
    isScannerOpen,
    scannedProduct,
    isLoading,
    scanError,
    handleOpenScanner,
    handleCloseScanner,
    handleScanResult,
    handleScanAnother,
    viewProductDetails
  } = useProductScanLogic();
  
  // التحقق من بيئة التشغيل
  const isNativePlatform = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  
  // نطبع معلومات البيئة للتشخيص
  useEffect(() => {
    console.log('ProductScan: البيئة الحالية:', isNativePlatform ? 'تطبيق جوال' : 'متصفح');
    console.log('ProductScan: المنصة:', platform);
    console.log('ProductScan: المكونات الإضافية المتاحة:', 
      Capacitor.isPluginAvailable('MLKitBarcodeScanner') ? 'MLKitBarcodeScanner متاح' : 'MLKitBarcodeScanner غير متاح');
    
    // عرض معلومات بيئة التشغيل في الواجهة للمستخدمين
    try {
      if (isNativePlatform) {
        Toast.show({
          text: `تم التشغيل على ${platform === 'android' ? 'أندرويد' : 'آيفون'}`,
          duration: "short"
        });
      }
    } catch (error) {
      console.error('ProductScan: خطأ في عرض المعلومات:', error);
    }
  }, [isNativePlatform, platform]);
  
  // فتح الماسح تلقائياً عند تحميل الصفحة فقط في بيئة التطبيق الجوال
  useEffect(() => {
    if (isNativePlatform && !isScannerOpen && !scannedProduct) {
      console.log('ProductScan: فتح الماسح فوراً في بيئة التطبيق');
      // تأخير قصير لضمان تحميل الواجهة أولاً
      const timer = setTimeout(() => {
        handleOpenScanner();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isNativePlatform, isScannerOpen, scannedProduct]);

  // إذا تم مسح المنتج، نعرض معلوماته
  if (scannedProduct) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        <ScannedProductCard
          product={scannedProduct}
          onScanAnother={handleScanAnother}
          onViewDetails={viewProductDetails}
        />
      </div>
    );
  }

  // إذا كان هناك خطأ في المسح
  if (scanError) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        <ErrorDisplay 
          error={scanError} 
          onRetry={handleOpenScanner} 
        />
      </div>
    );
  }

  // في بيئة المتصفح، نعرض رسالة بدل الماسح
  if (!isNativePlatform) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
        <div className="p-6 bg-white border rounded-lg">
          <BrowserView onClose={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  // إظهار الماسح مباشرة أو بطاقة بدء المسح
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {!isScannerOpen && (
        <InitialScanCard 
          onOpenScanner={handleOpenScanner}
          isLoading={isLoading}
          hasPermission={true}
        />
      )}
      
      {isScannerOpen && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">
            <ZXingBarcodeScanner
              onScan={handleScanResult}
              onClose={handleCloseScanner}
              autoStart={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScan;
