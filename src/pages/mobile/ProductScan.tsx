
import React from 'react';
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

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">مسح المنتجات</h1>
      
      {scanError && (
        <ErrorDisplay 
          error={scanError} 
          onRetry={handleOpenScanner} 
        />
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
          autoStart={true}
        />
      )}
    </div>
  );
};

export default ProductScan;
