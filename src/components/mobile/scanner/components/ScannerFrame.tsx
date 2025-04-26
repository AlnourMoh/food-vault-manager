
import React from 'react';

interface ScannerFrameProps {
  children?: React.ReactNode;
}

export const ScannerFrame = ({ children }: ScannerFrameProps) => {
  return (
    <div className="w-72 h-72 border-4 border-primary rounded-lg scanner-target-frame flex items-center justify-center">
      <div className="text-white text-center px-4">
        <p className="mb-2 font-bold">قم بتوجيه الكاميرا نحو الباركود</p>
        <p className="text-sm opacity-80">يتم المسح تلقائيًا عند اكتشاف رمز</p>
      </div>
      {children}
    </div>
  );
};
