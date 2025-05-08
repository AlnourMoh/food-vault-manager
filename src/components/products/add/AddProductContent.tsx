
import React from 'react';
import { PermissionErrorCard } from './PermissionErrorCard';
import { ScanButton } from './ScanButton';
import ZXingBarcodeScanner from '@/components/mobile/ZXingBarcodeScanner';
import { useProductScannerPermissions } from './useProductScannerPermissions';
import { useProductScanHandler } from './useProductScanHandler';

interface AddProductContentProps {
  isRestaurantRoute: boolean;
}

export const AddProductContent: React.FC<AddProductContentProps> = ({
  isRestaurantRoute
}) => {
  const {
    hasPermissionError,
    isRequestingPermission,
    handleRequestPermission,
    handleOpenSettings,
    handleScanButtonClick
  } = useProductScannerPermissions();

  const {
    scannerOpen,
    setScannerOpen,
    handleScanResult
  } = useProductScanHandler({ isRestaurantRoute });

  // This wrapper function ensures the return type is Promise<void>
  const openScanner = async () => {
    await handleScanButtonClick(setScannerOpen);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      {hasPermissionError ? (
        <PermissionErrorCard 
          onRequestPermission={handleRequestPermission}
          onOpenSettings={handleOpenSettings}
          isRequestingPermission={isRequestingPermission}
        />
      ) : (
        <ScanButton 
          onClick={openScanner}
          isLoading={isRequestingPermission}
        />
      )}

      {scannerOpen && (
        <ZXingBarcodeScanner
          onScan={handleScanResult}
          onClose={() => setScannerOpen(false)}
          autoStart={true}
        />
      )}
    </div>
  );
};
