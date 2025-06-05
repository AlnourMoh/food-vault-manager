
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flashlight, Keyboard, X, RotateCcw, Camera } from 'lucide-react';

export interface ScannerControlsProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
  onStartScan: () => Promise<boolean>;
  onStopScan: () => Promise<boolean>;
  onClose: () => void;
  onRetry: () => void;
  onToggleFlash?: () => void;
  onManualEntry?: () => void;
}

export const ScannerControls: React.FC<ScannerControlsProps> = ({ 
  isActive,
  cameraActive,
  hasError,
  onStartScan,
  onStopScan,
  onClose,
  onRetry,
  onToggleFlash,
  onManualEntry
}) => {
  return (
    <div className="absolute bottom-10 inset-x-0 flex justify-center gap-4">
      {/* عرض أزرار مختلفة بناءً على حالة الماسح */}
      {hasError ? (
        <Button 
          variant="secondary"
          size="lg" 
          className="rounded-full px-6"
          onClick={onRetry}
        >
          <RotateCcw className="h-5 w-5 ml-2" />
          إعادة المحاولة
        </Button>
      ) : isActive ? (
        <>
          {/* أزرار التحكم عندما يكون الماسح نشطًا */}
          <Button 
            variant="secondary"
            size="lg" 
            className="rounded-full px-6"
            onClick={() => onStopScan()}
          >
            <X className="h-5 w-5 ml-2" />
            إيقاف المسح
          </Button>
          
          {onToggleFlash && (
            <Button 
              variant="outline"
              size="icon" 
              className="rounded-full h-12 w-12 bg-background/20 hover:bg-background/40"
              onClick={onToggleFlash}
            >
              <Flashlight className="h-6 w-6 text-white" />
            </Button>
          )}
        </>
      ) : cameraActive ? (
        // الكاميرا نشطة لكن المسح متوقف
        <Button 
          variant="secondary"
          size="lg" 
          className="rounded-full px-6"
          onClick={() => onStartScan()}
        >
          <Camera className="h-5 w-5 ml-2" />
          بدء المسح
        </Button>
      ) : (
        // لا الكاميرا ولا المسح نشط
        <>
          <Button 
            variant="secondary"
            size="lg" 
            className="rounded-full px-6"
            onClick={() => onStartScan()}
          >
            <Camera className="h-5 w-5 ml-2" />
            تفعيل الكاميرا
          </Button>
          
          {onManualEntry && (
            <Button 
              variant="outline"
              size="lg" 
              className="rounded-full px-6"
              onClick={onManualEntry}
            >
              <Keyboard className="h-5 w-5 ml-2" />
              إدخال يدوي
            </Button>
          )}
        </>
      )}
      
      {/* زر الإغلاق متاح دائماً */}
      <Button 
        variant="destructive"
        size="lg" 
        className="rounded-full px-6"
        onClick={onClose}
      >
        <X className="h-5 w-5 ml-2" />
        إغلاق
      </Button>
    </div>
  );
};
