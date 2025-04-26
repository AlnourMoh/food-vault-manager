
import React from 'react';
import { WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  additionalInfo?: string;
}

const ErrorDisplay = ({ additionalInfo }: ErrorDisplayProps) => {
  return (
    <div className="space-y-3">
      <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold">صفحة الويب غير متاحة</h1>
      <p className="text-muted-foreground">
        يبدو أن هناك مشكلة في الاتصال بالخادم أو بالإنترنت. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
      </p>
      
      {additionalInfo && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mt-3 border border-red-200">
          <p className="font-semibold mb-1">معلومات الخطأ:</p>
          {additionalInfo}
        </div>
      )}
      
      <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-1 border border-blue-200">
        <p className="font-semibold mb-1">الحالة الحالية:</p>
        <p>متصل بالإنترنت: {navigator.onLine ? 'نعم ✓' : 'لا ✗'}</p>
        <p>محاولة الاتصال بـ: {window.location.hostname}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
