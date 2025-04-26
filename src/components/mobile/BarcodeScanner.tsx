
import React, { useEffect, useState } from 'react';
import { useScannerState } from '@/hooks/scanner/useScannerState';
import { ScannerLoading } from './scanner/ScannerLoading';
import { NoPermissionView } from './scanner/NoPermissionView';
import { ScannerView } from './scanner/ScannerView';
import { ScannerReadyView } from './scanner/ScannerReadyView';
import { DigitalCodeInput } from './scanner/DigitalCodeInput';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner as MLKitBarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  
  // Handle scanner initialization
  useEffect(() => {
    const initializeScanner = async () => {
      try {
        console.log('[BarcodeScanner] تهيئة ماسح الباركود...');
        
        // Check if we're running on a device with Capacitor
        if (window.Capacitor) {
          try {
            // Check if MLKit barcode scanner is available
            const available = await MLKitBarcodeScanner.isSupported();
            console.log('[BarcodeScanner] هل ماسح MLKit متاح:', available);
            
            if (available) {
              // Pre-check camera permissions
              const permissions = await MLKitBarcodeScanner.checkPermissions();
              console.log('[BarcodeScanner] حالة أذونات الكاميرا:', permissions);
              
              if (permissions.camera === 'prompt') {
                console.log('[BarcodeScanner] سيتم عرض طلب إذن الاستخدام');
              } else if (permissions.camera === 'denied') {
                console.log('[BarcodeScanner] تم رفض إذن الكاميرا');
                toast({
                  title: "إذن الكاميرا مرفوض",
                  description: "يرجى منح إذن الكاميرا في إعدادات التطبيق",
                  variant: "destructive"
                });
              } else if (permissions.camera === 'granted') {
                console.log('[BarcodeScanner] تم منح إذن الكاميرا بالفعل');
              }
            } else {
              console.log('[BarcodeScanner] ماسح MLKit غير متاح على هذا الجهاز');
              toast({
                title: "ماسح الباركود غير متوفر",
                description: "جهازك لا يدعم ماسح الباركود، سيتم استخدام وضع الإدخال اليدوي",
                variant: "default"
              });
              // Automatically switch to manual mode if scanner isn't available
              setIsManualEntry(true);
            }
          } catch (error) {
            console.error('[BarcodeScanner] خطأ في فحص توفر ماسح الباركود:', error);
            // Show detailed error in development mode
            console.error('Error details:', JSON.stringify(error));
          }
        } else {
          console.log('[BarcodeScanner] تشغيل في بيئة الويب، استخدام ماسح وهمي');
        }
      } catch (error) {
        console.error('[BarcodeScanner] خطأ أثناء تهيئة الماسح:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeScanner();
    
    // Cleanup
    return () => {
      console.log('[BarcodeScanner] تنظيف مكون الماسح');
      // Make sure any UI changes are reverted on unmount
      document.body.style.background = '';
      document.body.classList.remove('barcode-scanner-active');
      document.body.classList.remove('scanner-transparent-background');
    };
  }, [toast]);
  
  const {
    isLoading,
    hasPermission,
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  } = useScannerState({ onScan, onClose });
  
  // Automatically start scanning when the component mounts if we have permission
  useEffect(() => {
    console.log('[BarcodeScanner] تحديث حالة الماسح - hasPermission:', hasPermission, 'isLoading:', isLoading, 'isScanningActive:', isScanningActive);
    
    const initializeScanner = async () => {
      try {
        // Only start scanning if we're not loading, not initializing, have permission, not already scanning, and not in manual entry mode
        if (!isLoading && !isInitializing) {
          if (hasPermission === true && !isScanningActive && !isManualEntry) {
            console.log('[BarcodeScanner] بدء المسح تلقائيًا لأن لدينا الإذن');
            await startScan();
          }
        }
      } catch (error) {
        console.error('[BarcodeScanner] خطأ في تهيئة الماسح:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تهيئة الماسح الضوئي",
          variant: "destructive"
        });
      }
    };
    
    // Initialize the scanner when component is ready
    if (!isInitializing) {
      initializeScanner();
    }
    
    return () => {
      console.log('[BarcodeScanner] تنظيف useEffect, إيقاف المسح');
      stopScan();
    };
  }, [hasPermission, isLoading, isScanningActive, startScan, stopScan, isManualEntry, toast, isInitializing]);
  
  const handleRequestPermission = async () => {
    console.log('[BarcodeScanner] طلب الإذن بشكل صريح...');
    try {
      console.log('[BarcodeScanner] بدء عملية طلب الإذن والمسح');
      const result = await startScan();
      console.log('[BarcodeScanner] نتيجة طلب الإذن والمسح:', result);
    } catch (error) {
      console.error('[BarcodeScanner] خطأ في طلب الإذن:', error);
      toast({
        title: "خطأ في الإذن",
        description: "حدث خطأ أثناء طلب إذن الكاميرا",
        variant: "destructive"
      });
    }
  };
  
  const handleManualEntry = () => {
    console.log('[BarcodeScanner] التحويل إلى إدخال الكود يدويًا');
    stopScan(); // Make sure to stop any active scanning
    setIsManualEntry(true);
  };
  
  const handleManualSubmit = (code: string) => {
    console.log('[BarcodeScanner] تم إرسال الكود يدويًا:', code);
    onScan(code);
  };
  
  const handleManualCancel = () => {
    console.log('[BarcodeScanner] تم إلغاء الإدخال اليدوي');
    setIsManualEntry(false);
  };
  
  if (isManualEntry) {
    return (
      <DigitalCodeInput 
        onSubmit={handleManualSubmit}
        onCancel={handleManualCancel}
      />
    );
  }
  
  if (isInitializing || isLoading) {
    return <ScannerLoading />;
  }
  
  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        <ScannerView 
          onStop={stopScan} 
          hasPermissionError={hasPermission === false}
          onRequestPermission={handleRequestPermission}
          onManualEntry={handleManualEntry}
        />
      ) : (
        hasPermission === false ? (
          <NoPermissionView 
            onClose={onClose} 
            onRequestPermission={handleRequestPermission}
            onManualEntry={handleManualEntry}
          />
        ) : (
          <ScannerReadyView
            lastScannedCode={lastScannedCode}
            onStartScan={startScan}
            onClose={onClose}
            onManualEntry={handleManualEntry}
          />
        )
      )}
    </div>
  );
};

export default BarcodeScanner;
