
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

  // Fix the function to properly return Promise<void> instead of Promise<boolean>
  const openScanner = async (): Promise<void> => {
    try {
      console.log('Main button clicked, opening scanner directly');
      setScannerOpen(true);
      // No return statement needed as this function should return void
    } catch (error) {
      console.error("Error opening scanner:", error);
      // Still no return statement, since we want this to be void
    }
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
