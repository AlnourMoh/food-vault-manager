
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [manualCode, setManualCode] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode);
      setManualCode('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-100 border rounded-md p-6 mb-4 text-center">
        <div className="flex items-center justify-center h-48 bg-gray-200 rounded-md mb-4">
          <p className="text-gray-500">كاميرا الباركود</p>
          <p className="text-xs text-gray-400 mt-2">
            (هذه محاكاة للكاميرا - استخدم الإدخال اليدوي أدناه)
          </p>
        </div>
      </div>
      
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="أدخل الباركود يدويًا"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">إدخال</Button>
      </form>
    </div>
  );
};
