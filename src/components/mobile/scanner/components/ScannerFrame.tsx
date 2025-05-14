
import React from 'react';

interface ScannerFrameProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({ 
  isActive, 
  cameraActive, 
  hasError 
}) => {
  if (hasError) {
    return (
      <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-red-500/50 rounded-lg flex items-center justify-center">
          <div className="text-red-500 text-center p-4">
            <p>حدث خطأ في الكاميرا</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/95 flex items-center justify-center">
      {/* إطار المسح */}
      <div className="relative w-72 h-72 border-2 border-white/50 rounded-lg overflow-hidden">
        {isActive && cameraActive && (
          <div className="absolute inset-0">
            {/* خط المسح المتحرك */}
            <div className="w-full h-1 bg-red-500 absolute top-1/2 animate-[scanner_2s_ease-in-out_infinite]"></div>
          </div>
        )}
      </div>
    </div>
  );
};
