
import React, { useEffect } from 'react';
import { useProductScanLogic } from '@/hooks/mobile/scan/useProductScanLogic';
import { InitialScanCard } from '@/components/mobile/scanner/product/InitialScanCard';
import { ScannedProductCard } from '@/components/mobile/scanner/product/ScannedProductCard';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { ErrorDisplay } from '@/components/mobile/scanner/product/ErrorDisplay';

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
  
  // فتح الماسح تلقائياً عند تحميل الصفحة بدون تأخير
  useEffect(() => {
    console.log('ProductScan: فتح الماسح فوراً');
    handleOpenScanner();
  }, []);

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

  // إظهار الماسح مباشرة
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {!isScannerOpen && (
        <InitialScanCard 
          onOpenScanner={handleOpenScanner}
          isLoading={isLoading}
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
