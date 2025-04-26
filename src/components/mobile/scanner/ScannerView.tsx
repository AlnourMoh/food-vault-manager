
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScannerControls } from './components/ScannerControls';
import { ScannerFrame } from './components/ScannerFrame';
import { ScannerStatusIndicator } from './components/ScannerStatusIndicator';
import { PermissionErrorView } from './components/PermissionErrorView';

interface ScannerViewProps {
  onStop: () => void;
  hasPermissionError?: boolean;
  onRequestPermission?: () => void;
  onManualEntry?: () => void;
}

export const ScannerView = ({
  onStop,
  hasPermissionError = false,
  onRequestPermission,
  onManualEntry
}: ScannerViewProps) => {
  const scannerActive = useRef(false);
  const flashOn = useRef(false);

  useEffect(() => {
    console.log("ScannerView mounted, hasPermissionError:", hasPermissionError);
    const setupScannerUI = async () => {
      if (!hasPermissionError) {
        try {
          console.log("Setting up scanner UI");
          scannerActive.current = true;
          
          // Making sure the UI is ready before activating the scanner
          setTimeout(() => {
            document.body.style.visibility = 'visible';
            document.body.classList.add('barcode-scanner-active');
            document.body.classList.add('scanner-transparent-background');
            document.body.style.background = 'transparent';
            
            // Check if BarcodeScanner plugin is available before calling
            if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
              try {
                console.log("Preparing BarcodeScanner...");
                // Dynamically import to avoid errors in web environment
                import('@capacitor-community/barcode-scanner').then(({ BarcodeScanner }) => {
                  BarcodeScanner.prepare();
                }).catch(err => {
                  console.error('Error loading BarcodeScanner:', err);
                });
              } catch (e) {
                console.error('Error preparing BarcodeScanner:', e);
              }
            }
          }, 100);
        } catch (e) {
          console.error('Error setting up scanner UI:', e);
        }
      }
    };
    
    setupScannerUI();
    
    return () => {
      try {
        console.log("ScannerView unmounting - cleaning up UI");
        scannerActive.current = false;
        document.body.style.visibility = 'visible';
        document.body.classList.remove('barcode-scanner-active');
        document.body.classList.remove('scanner-transparent-background');
        document.body.style.background = '';
        
        // Clean up the BarcodeScanner
        if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
          import('@capacitor-community/barcode-scanner').then(({ BarcodeScanner }) => {
            BarcodeScanner.showBackground().catch(e => console.error('Error showing background:', e));
            BarcodeScanner.stopScan().catch(e => console.error('Error stopping scan:', e));
          }).catch(err => {
            console.error('Error loading BarcodeScanner for cleanup:', err);
          });
        }
      } catch (e) {
        console.error('Error restoring UI on unmount:', e);
      }
    };
  }, [hasPermissionError]);

  const toggleFlashlight = async () => {
    if (!window.Capacitor || !window.Capacitor.isPluginAvailable('BarcodeScanner')) return;
    
    try {
      console.log(`Toggling flashlight`);
      import('@capacitor-community/barcode-scanner').then(({ BarcodeScanner }) => {
        BarcodeScanner.toggleTorch();
        flashOn.current = !flashOn.current;
      }).catch(err => {
        console.error('Error loading BarcodeScanner for flashlight:', err);
      });
    } catch (error) {
      console.error('Error toggling flashlight:', error);
    }
  };

  if (hasPermissionError) {
    return (
      <PermissionErrorView
        onRequestPermission={onRequestPermission || (() => {})}
        onManualEntry={onManualEntry}
        onStop={onStop}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-50">
      <ScannerStatusIndicator />
      
      <div className="flex-1 w-full relative flex items-center justify-center">
        <ScannerFrame />
        
        <ScannerControls
          onToggleFlash={toggleFlashlight}
          onManualEntry={onManualEntry || (() => {})}
        />
        
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={onStop}
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};
