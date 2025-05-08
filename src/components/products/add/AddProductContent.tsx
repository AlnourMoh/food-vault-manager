
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

  // Fixed function to properly have Promise<void> return type
  const openScanner = async (): Promise<void> => {
    try {
      console.log('Main button clicked, opening scanner directly');
      // Simply set scanner to open - we'll handle permissions in the ZXingBarcodeScanner component
      setScannerOpen(true);
      // Not returning anything here, to match the Promise<void> signature
    } catch (error) {
      console.error("Error opening scanner:", error);
      // Not returning anything in the catch block either
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
