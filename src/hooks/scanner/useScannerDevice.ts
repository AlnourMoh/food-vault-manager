
export const useScannerDevice = () => {
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("Starting device scan");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("Using Capacitor BarcodeScanner plugin");
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        
        // Check if camera permission is granted
        const status = await BarcodeScanner.checkPermission({ force: false });
        if (status.granted) {
          document.body.classList.add('barcode-scanner-active');
          
          // Hide the UI elements that might interfere with the scanner
          document.querySelector('app-root')?.classList.add('scanner-active');
          
          // Prepare the scanner
          await BarcodeScanner.prepare();
          
          // Start the scanner
          console.log("Starting barcode scanner");
          const result = await BarcodeScanner.startScan();
          
          if (result.hasContent) {
            console.log("Barcode scanned:", result.content);
            onSuccess(result.content);
          }
        } else if (status.denied) {
          console.log("Camera permission denied");
        }
      } else {
        console.log("Running in web environment or plugin not available - using test barcode");
        // For development/web: simulate scanning
        setTimeout(() => {
          // For testing, generate a random code or use a test code that exists in your database
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
          console.log("Test barcode:", mockBarcode);
          onSuccess(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error("Error starting device scan:", error);
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("Stopping device scan");
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        await BarcodeScanner.stopScan();
        document.body.classList.remove('barcode-scanner-active');
        document.querySelector('app-root')?.classList.remove('scanner-active');
      }
    } catch (error) {
      console.error("Error stopping device scan:", error);
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
