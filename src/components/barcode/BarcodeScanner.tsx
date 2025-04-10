
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanBarcode, Camera } from 'lucide-react';

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

  // Demo product codes for quick access
  const demoProducts = [
    { code: '12345', name: 'زيت زيتون' },
    { code: '54321', name: 'طماطم' },
    { code: '67890', name: 'دقيق' }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-100 border rounded-md p-4 mb-4">
        <div className="flex items-center justify-center h-40 bg-gray-200 rounded-md mb-4">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">كاميرا الباركود</p>
            <p className="text-xs text-gray-400 mt-2">
              (هذه محاكاة للكاميرا - استخدم الإدخال اليدوي أدناه)
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleManualSubmit} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="أدخل الباركود يدويًا"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <ScanBarcode className="ml-2 h-4 w-4" />
          إدخال
        </Button>
      </form>

      <div className="bg-gray-50 p-3 rounded-md border">
        <h4 className="text-sm font-medium mb-2">اختر منتجًا للاختبار:</h4>
        <div className="grid grid-cols-3 gap-2">
          {demoProducts.map(product => (
            <Button 
              key={product.code}
              variant="outline" 
              className="text-xs py-1 h-auto"
              onClick={() => onScan(product.code)}
            >
              {product.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
