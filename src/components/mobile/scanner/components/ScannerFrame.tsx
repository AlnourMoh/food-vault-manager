
import React from 'react';

interface ScannerFrameProps {
  isActive: boolean;
  cameraActive: boolean;
  hasError: boolean;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({ isActive, cameraActive, hasError }) => {
  // تعديل مظهر الإطار بناءً على حالة الماسح
  let borderColor = "border-neutral-500 opacity-50";
  let pulseEffect = "";
  
  if (hasError) {
    borderColor = "border-red-500";
  } else if (isActive && cameraActive) {
    borderColor = "border-green-500";
    pulseEffect = "animate-pulse";
  } else if (cameraActive) {
    borderColor = "border-blue-500";
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* أضف عنصر خلفية للفيديو عند تفعيل الكاميرا */}
      {cameraActive && (
        <div className="absolute inset-0 bg-black opacity-80" />
      )}
      
      {/* إطار التصوير */}
      <div className={`w-64 h-64 border-2 ${borderColor} rounded-lg ${pulseEffect} relative`}>
        {/* أشعة الزاوية */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br"></div>
        
        {/* خط المسح المتحرك عند النشاط */}
        {isActive && cameraActive && !hasError && (
          <div className="absolute left-0 right-0 h-1 bg-green-500 animate-scanner-line"></div>
        )}
      </div>
    </div>
  );
};
