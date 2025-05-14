
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ScannerStatusIndicatorProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
}

export const ScannerStatusIndicator: React.FC<ScannerStatusIndicatorProps> = ({
  isActive,
  cameraActive,
  hasError
}) => {
  if (hasError) {
    return null;
  }

  if (!cameraActive) {
    return (
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <Spinner size="lg" className="mb-4" />
        <p className="text-white">جاري تفعيل الكاميرا...</p>
      </div>
    );
  }

  if (!isActive && cameraActive) {
    return (
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-white bg-black/50 backdrop-blur-sm py-1 px-3 rounded-full text-sm">
          المسح متوقف
        </p>
      </div>
    );
  }

  return null;
};
