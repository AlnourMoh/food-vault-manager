
import React from 'react';
import { QrCode } from 'lucide-react';

const EmptyBarcodeState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <QrCode className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">لا توجد باركودات لهذا المنتج</h3>
      <p className="text-gray-500 mt-2 text-center max-w-md">
        قد تكون هناك مشكلة في صلاحيات قاعدة البيانات. يرجى التواصل مع مسؤول النظام لإنشاء الصلاحيات اللازمة.
      </p>
    </div>
  );
};

export default EmptyBarcodeState;
