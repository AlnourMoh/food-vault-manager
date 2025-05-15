
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import '@/types/barcode-scanner-augmentation.d.ts';

const CapacitorTester = () => {
  const [platformInfo, setPlatformInfo] = useState<string>('');
  const [pluginsInfo, setPluginsInfo] = useState<string>('');
  const [scannerSupported, setScannerSupported] = useState<boolean | null>(null);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getPlatformInfo = async () => {
      try {
        // Get platform info
        const platform = Capacitor.getPlatform();
        const isNative = Capacitor.isNativePlatform();
        setPlatformInfo(`Platform: ${platform}, Native: ${isNative ? 'Yes' : 'No'}`);
        
        // Check available plugins
        const hasMLKit = Capacitor.isPluginAvailable('MLKitBarcodeScanner');
        const hasCamera = Capacitor.isPluginAvailable('Camera');
        const hasToast = Capacitor.isPluginAvailable('Toast');
        setPluginsInfo(`MLKit: ${hasMLKit ? 'Yes' : 'No'}, Camera: ${hasCamera ? 'Yes' : 'No'}, Toast: ${hasToast ? 'Yes' : 'No'}`);

        // Check if scanner is supported
        if (hasMLKit) {
          try {
            const support = await BarcodeScanner.isSupported();
            setScannerSupported(support.supported);
          } catch (error) {
            console.error('Error checking scanner support:', error);
            setScannerSupported(false);
          }
        } else {
          setScannerSupported(false);
        }

        // Check camera permission
        if (hasMLKit) {
          try {
            const permission = await BarcodeScanner.checkPermissions();
            setCameraPermission(permission.camera);
          } catch (error) {
            console.error('Error checking permission:', error);
            setCameraPermission('error');
          }
        }
      } catch (error) {
        console.error('Error getting platform info:', error);
      }
    };

    getPlatformInfo();
  }, []);

  const handleRequestPermission = async () => {
    try {
      const result = await BarcodeScanner.requestPermissions();
      setCameraPermission(result.camera);
      toast({
        title: "Permission status",
        description: `Camera permission: ${result.camera}`
      });
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Error",
        description: "Could not request camera permission",
        variant: "destructive"
      });
    }
  };

  const handleTestScan = async () => {
    try {
      toast({
        title: "Starting scan test",
        description: "Please wait..."
      });

      await BarcodeScanner.scan().then(result => {
        if (result.barcodes && result.barcodes.length > 0) {
          toast({
            title: "Scan successful",
            description: `Code: ${result.barcodes[0].rawValue}`
          });
        } else {
          toast({
            title: "No barcode detected",
            description: "Try again with a clear barcode"
          });
        }
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-3 bg-gray-100 rounded-md text-sm">
      <h3 className="font-medium mb-2">Capacitor Diagnostics:</h3>
      <div className="space-y-1 mb-3">
        <p>{platformInfo}</p>
        <p>{pluginsInfo}</p>
        <p>Scanner supported: {scannerSupported === null ? 'Checking...' : scannerSupported ? 'Yes' : 'No'}</p>
        <p>Camera permission: {cameraPermission || 'Unknown'}</p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          size="sm" 
          onClick={handleRequestPermission}
          disabled={!scannerSupported}
        >
          Request Camera Permission
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleTestScan}
          disabled={!scannerSupported || cameraPermission !== 'granted'}
          variant="secondary"
        >
          Test Scanner
        </Button>
      </div>
    </div>
  );
};

export default CapacitorTester;
