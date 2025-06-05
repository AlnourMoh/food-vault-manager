
import React from 'react';
import { AlertCircle, Camera, Check } from 'lucide-react';

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
  // تحديد حالة ولون المؤشر
  let Icon = Camera;
  let bgColor = "bg-yellow-500";
  let statusText = "جاري التهيئة...";
  
  if (hasError) {
    Icon = AlertCircle;
    bgColor = "bg-red-500";
    statusText = "خطأ في المسح";
  } else if (isActive && cameraActive) {
    Icon = Camera;
    bgColor = "bg-green-500";
    statusText = "جاري المسح...";
  } else if (cameraActive) {
    Icon = Camera;
    bgColor = "bg-blue-500";
    statusText = "الكاميرا جاهزة";
  }
  
  return (
    <div className="absolute top-6 inset-x-0 flex justify-center">
      <div className={`${bgColor} text-white px-4 py-2 rounded-full flex items-center shadow-lg`}>
        <Icon className="h-5 w-5 ml-2" />
        <span className="text-sm font-medium">{statusText}</span>
      </div>
    </div>
  );
};
