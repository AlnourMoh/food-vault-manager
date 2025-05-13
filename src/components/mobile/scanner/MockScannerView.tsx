
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarcodeIcon } from 'lucide-react';

interface MockScannerViewProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const MockScannerView = ({ onScan, onClose }: MockScannerViewProps) => {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = () => {
    if (!barcodeValue.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    // محاكاة تأخير بسيط لجعل تجربة المستخدم أكثر واقعية
    setTimeout(() => {
      onScan(barcodeValue.trim());
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-black text-white min-h-[50vh] p-6 rounded-lg flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
        <BarcodeIcon size={32} className="text-blue-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-6">محاكاة مسح الباركود</h2>
      
      <div className="w-full max-w-xs space-y-4">
        <Input
          type="text"
          value={barcodeValue}
          onChange={(e) => setBarcodeValue(e.target.value)}
          placeholder="أدخل رمز الباركود هنا"
          className="bg-gray-900 border-gray-700 text-white"
        />
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleScan}
            disabled={!barcodeValue.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? 'جاري المسح...' : 'مسح'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            إلغاء
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            هذا الوضع يحاكي عملية المسح الضوئي للباركود
            <br/>
            مناسب للتجربة في بيئة التطوير
          </p>
        </div>
      </div>
    </div>
  );
};
