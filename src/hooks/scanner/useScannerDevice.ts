
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("Starting device scan");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("Using Capacitor BarcodeScanner plugin");
        
        // Check if camera permission is granted for barcode scanner
        const status = await BarcodeScanner.checkPermission({ force: false });
        console.log("BarcodeScanner permission status:", status);
        
        if (!status.granted) {
          console.log("Requesting barcode scanner permission...");
          const requestResult = await BarcodeScanner.checkPermission({ force: true });
          console.log("BarcodeScanner force permission request result:", requestResult);
          
          if (!requestResult.granted) {
            console.error("Permission denied for barcode scanner");
            throw new Error("Permission denied for barcode scanner");
          }
        }
        
        // Make background transparent to show camera preview
        document.body.classList.add('barcode-scanner-active');
        
        // Hide any elements that might be in the way
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
      } else {
        console.log("Running in web environment or plugin not available - using test barcode");
        // For development/web: simulate scanning
        toast({
          title: "نسخة الويب",
          description: "هذا محاكاة للماسح الضوئي في بيئة الويب",
        });
        
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
