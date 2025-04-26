
import React from 'react';
import { WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  additionalInfo?: string;
}

const ErrorDisplay = ({ additionalInfo }: ErrorDisplayProps) => {
  return (
    <div className="space-y-2">
      <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold">عذراً، حدث خطأ في الاتصال</h1>
      <p className="text-muted-foreground">
        يبدو أن هناك مشكلة في الاتصال بالإنترنت أو السيرفر. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
      </p>
      {additionalInfo && (
        <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm mt-2">
          {additionalInfo}
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
