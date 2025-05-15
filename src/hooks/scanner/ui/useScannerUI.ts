
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useScannerUI = () => {
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Function to set up scanner background before scanning
  const setupScannerBackground = async (): Promise<boolean> => {
    try {
      console.log('[useScannerUI] Setting up scanner background');
      
      // Add any UI setup code here
      document.body.classList.add('scanner-active');
      
      // Hide any UI elements that might interfere with scanning
      const elementsToHide = document.querySelectorAll('header, nav, footer');
      elementsToHide.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] Error setting up scanner background:', error);
      return false;
    }
  };

  // Function to restore UI after scanning
  const restoreUIAfterScanning = async (): Promise<boolean> => {
    try {
      console.log('[useScannerUI] Restoring UI after scanning');
      
      // Restore UI elements
      document.body.classList.remove('scanner-active');
      
      const elementsToRestore = document.querySelectorAll('header, nav, footer');
      elementsToRestore.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
      
      return true;
    } catch (error) {
      console.error('[useScannerUI] Error restoring UI after scanning:', error);
      return false;
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      restoreUIAfterScanning().catch(console.error);
    };
  }, []);

  // Functions for manual code entry
  const handleManualEntry = () => {
    setIsManualEntry(true);
  };
  
  const handleManualCancel = () => {
    setIsManualEntry(false);
  };

  // Function for cleanup
  const cleanup = async () => {
    await restoreUIAfterScanning();
    setIsManualEntry(false);
  };

  return {
    isManualEntry,
    setupScannerBackground,
    restoreUIAfterScanning,
    handleManualEntry,
    handleManualCancel,
    cleanup
  };
};
