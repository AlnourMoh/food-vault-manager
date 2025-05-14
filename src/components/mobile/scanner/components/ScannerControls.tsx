
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, RefreshCw, FlashlightIcon } from 'lucide-react';

interface ScannerControlsProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onRetry: () => void;
  onClose: () => void;
  onToggleFlash?: () => void;
}

export const ScannerControls: React.FC<ScannerControlsProps> = ({
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onRetry,
  onClose,
  onToggleFlash
}) => {
  // تجنب عرض أزرار التحكم إذا كانت الكاميرا غير نشطة أو في حالة خطأ
  if (!cameraActive || hasError) {
    return null;
  }

  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-full py-2 px-4 flex items-center space-x-4">
        {isActive ? (
          <Button
            onClick={() => onStopScan()}
            className="bg-white text-black hover:bg-gray-200 rounded-full p-2 size-12"
            variant="ghost"
          >
            <span className="sr-only">إيقاف المسح</span>
            <Pause className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={() => onStartScan()}
            className="bg-white text-black hover:bg-gray-200 rounded-full p-2 size-12"
            variant="ghost"
          >
            <span className="sr-only">بدء المسح</span>
            <Play className="h-6 w-6" />
          </Button>
        )}

        {onToggleFlash && (
          <Button
            onClick={onToggleFlash}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 size-12"
            variant="ghost"
          >
            <span className="sr-only">تبديل الفلاش</span>
            <FlashlightIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};
