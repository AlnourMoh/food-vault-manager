
import React from 'react';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import { ScannerErrorView } from './ScannerErrorView';

interface ScanProductContentProps {
  hasScannerError: boolean;
  showScanner: boolean;
  isProcessing: boolean;
  onRetry: () => void;
  onScan: (code: string) => void;
  onClose: () => void;
}

export const ScanProductContent = ({
  hasScannerError,
  showScanner,
  isProcessing,
  onRetry,
  onScan,
  onClose
}: ScanProductContentProps) => {
  return (
    <div 
      className="h-[calc(100vh-120px)] relative flex items-center justify-center overflow-hidden"
      style={{
        position: 'relative'
      }}
    >
      {hasScannerError ? (
        <ScannerErrorView onRetry={onRetry} />
      ) : (
        showScanner && (
          <div className="scanner-container" style={{
            position: 'absolute',
            inset: 0,
          }}>
            <BarcodeScanner
              onScan={onScan}
              onClose={onClose}
            />
          </div>
        )
      )}
    </div>
  );
};
