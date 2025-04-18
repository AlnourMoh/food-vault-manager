
export const useScannerDevice = () => {
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      document.body.classList.add('barcode-scanner-active');
      
      const result = await BarcodeScanner.startScan();
      
      if (result.hasContent) {
        onSuccess(result.content);
      }
    } else {
      // For development/web: simulate scanning
      setTimeout(() => {
        const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
        onSuccess(mockBarcode);
      }, 2000);
    }
  };
  
  const stopDeviceScan = async () => {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      await BarcodeScanner.stopScan();
      document.body.classList.remove('barcode-scanner-active');
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
