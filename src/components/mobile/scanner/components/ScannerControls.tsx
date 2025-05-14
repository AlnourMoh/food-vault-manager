
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, ZapOff, Zap, Keyboard } from 'lucide-react';

interface ScannerControlsProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onToggleFlash?: () => void;
  onManualEntry?: () => void; // Added this prop
}

export const ScannerControls: React.FC<ScannerControlsProps> = ({
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose,
  onToggleFlash,
  onManualEntry
}) => {
  if (hasError) {
    return null; // No controls shown in error state
  }

  return (
    <div className="scanner-controls absolute bottom-6 left-0 right-0 px-6">
      {isActive ? (
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => onStopScan()}
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            إلغاء المسح
          </Button>
          
          {onManualEntry && (
            <Button
              onClick={onManualEntry}
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <Keyboard className="mr-1 h-4 w-4" />
              إدخال يدوي
            </Button>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          {cameraActive && (
            <Button
              onClick={() => onStartScan()}
              className="bg-white text-black hover:bg-gray-100 px-6 py-2"
            >
              <Zap className="mr-1 h-4 w-4" />
              بدء المسح
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
