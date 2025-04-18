
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useScannerDevice = () => {
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("Starting device scan");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("Using Capacitor BarcodeScanner plugin");
        
        // Check if camera permission is granted
        const status = await BarcodeScanner.checkPermission({ force: false });
        console.log("BarcodeScanner permission status:", status);
        
        if (status.granted) {
          // Make background transparent to show camera preview
          document.body.classList.add('barcode-scanner-active');
          document.querySelector('ion-app')?.classList.add('scanner-active');
          
          // Hide any other elements that might be in the way
          const appRoot = document.querySelector('app-root') || document.body;
          appRoot.classList.add('scanner-active');
          
          // Prepare the scanner
          await BarcodeScanner.prepare();
          console.log("Barcode scanner prepared, starting scan...");
          
          // Start the scanner with a more visible highlight
          const result = await BarcodeScanner.startScan({
            targetedFormats: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_39', 'CODE_128'],
          });
          
          if (result.hasContent) {
            console.log("Barcode scanned:", result.content);
            onSuccess(result.content);
          }
        } else if (status.denied) {
          console.log("Camera permission denied for barcode scanner");
          // Not handling permission here as we already do in useCameraPermissions
        } else {
          console.log("Requesting barcode scanner permission...");
          const requestResult = await BarcodeScanner.checkPermission({ force: true });
          
          if (requestResult.granted) {
            // If permission granted, try again
            return startDeviceScan(onSuccess);
          }
        }
      } else {
        console.log("Running in web environment or plugin not available - using test barcode");
        // For development/web: simulate scanning
        setTimeout(() => {
          // For testing, generate a random code that would likely exist in the database
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000)}`;
          console.log("Test barcode:", mockBarcode);
          onSuccess(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error("Error starting device scan:", error);
      throw error; // Propagate error to be handled by caller
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("Stopping device scan");
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        // Stop the scanner
        await BarcodeScanner.stopScan();
        
        // Restore the UI
        document.body.classList.remove('barcode-scanner-active');
        document.querySelector('ion-app')?.classList.remove('scanner-active');
        
        const appRoot = document.querySelector('app-root') || document.body;
        appRoot.classList.remove('scanner-active');
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
