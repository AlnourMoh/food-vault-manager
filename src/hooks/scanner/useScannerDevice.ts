
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useToast } from '@/hooks/use-toast';
import { App } from '@capacitor/app';

export const useScannerDevice = () => {
  const { toast } = useToast();
  
  const startDeviceScan = async (onSuccess: (code: string) => void) => {
    try {
      console.log("Starting device scan");
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        console.log("Using Capacitor BarcodeScanner plugin");
        
        // Check if permission is already granted
        const status = await BarcodeScanner.checkPermission({ force: true });
        console.log("BarcodeScanner permission status:", status);
        
        if (!status.granted) {
          console.error("Permission denied for barcode scanner");
          toast({
            title: "تم رفض الإذن",
            description: "لم يتم منح إذن الكاميرا. يرجى تمكين الإذن في إعدادات جهازك.",
            variant: "destructive"
          });
          throw new Error("Permission denied for barcode scanner");
        }
        
        // Prepare the scanner
        await BarcodeScanner.prepare();
        console.log("Barcode scanner prepared successfully");
        
        // Hide the entire app interface to show the camera preview
        document.body.style.visibility = 'hidden';
        document.body.classList.add('barcode-scanner-active');
        
        // Make the scanner area visible
        await BarcodeScanner.hideBackground();
        console.log("Background hidden for scanner");
        
        // Start the scanner with improved settings
        console.log("Starting scanner...");
        const result = await BarcodeScanner.startScan({
          targetedFormats: ['QR_CODE', 'EAN_13', 'EAN_8', 'CODE_39', 'CODE_128', 'UPC_A', 'UPC_E', 
                           'PDF_417', 'AZTEC', 'DATA_MATRIX', 'ITF', 'CODABAR'],
          cameraDirection: 'back'
        });
        
        console.log("Scan result:", result);
        
        if (result.hasContent) {
          console.log("Barcode scanned:", result.content);
          // Show app UI again
          document.body.style.visibility = 'visible';
          document.body.classList.remove('barcode-scanner-active');
          await BarcodeScanner.showBackground();
          onSuccess(result.content);
        } else {
          console.log("Scan completed but no content found");
          // Show app UI again if no content
          document.body.style.visibility = 'visible';
          document.body.classList.remove('barcode-scanner-active');
          await BarcodeScanner.showBackground();
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
      // Ensure UI is visible in case of error
      document.body.style.visibility = 'visible';
      document.body.classList.remove('barcode-scanner-active');
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        await BarcodeScanner.showBackground();
        await BarcodeScanner.stopScan();
      }
      throw error; // Propagate error to be handled by caller
    }
  };
  
  const stopDeviceScan = async () => {
    try {
      console.log("Stopping device scan");
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        // Stop the scanner
        await BarcodeScanner.stopScan();
        console.log("Scanner stopped");
        
        // Make sure app UI is visible again
        document.body.style.visibility = 'visible';
        document.body.classList.remove('barcode-scanner-active');
        
        // Hide camera layer
        await BarcodeScanner.showBackground();
        console.log("Background restored");
      }
    } catch (error) {
      console.error("Error stopping device scan:", error);
      // Ensure UI is visible in case of error
      document.body.style.visibility = 'visible';
      document.body.classList.remove('barcode-scanner-active');
    }
  };
  
  return {
    startDeviceScan,
    stopDeviceScan
  };
};
