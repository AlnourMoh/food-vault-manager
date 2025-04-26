
import React from 'react';

export const InitialLoading = () => {
  return (
    <div className="rtl min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">جاري تحميل التطبيق...</p>
      </div>
    </div>
  );
};
