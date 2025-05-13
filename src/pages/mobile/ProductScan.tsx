
import React, { useEffect } from 'react';
import { useProductScanLogic } from '@/hooks/mobile/scan/useProductScanLogic';
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ErrorDisplay } from '@/components/mobile/scanner/product/ErrorDisplay';
import { Capacitor } from '@capacitor/core';

const ProductScan = () => {
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
  
  // فتح الماسح تلقائياً عند تحميل الصفحة فقط في بيئة التطبيق الجوال
  useEffect(() => {
    console.log('ProductScan: البيئة الحالية:', isNativePlatform ? 'تطبيق جوال' : 'متصفح');
    if (isNativePlatform) {
      console.log('ProductScan: فتح الماسح فوراً في بيئة التطبيق');
      handleOpenScanner();
    }
  }, [isNativePlatform]);

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
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">المسح غير متاح في المتصفح</h2>
          <p className="text-gray-700 mb-4">
            عملية مسح الباركود متاحة فقط في تطبيق الهاتف المحمول.
            يرجى استخدام تطبيق الجوال للقيام بعمليات المسح.
          </p>
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
