
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { BarcodeIcon, X, Loader2 } from 'lucide-react';
import { ScannerFrame } from './components/ScannerFrame';
import { Input } from '@/components/ui/input';

interface MockScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const MockScanner: React.FC<MockScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // تلقائيا محاكاة عملية المسح الضوئي عند تحميل المكون
  useEffect(() => {
    startMockScan();
  }, []);

  const startMockScan = () => {
    setIsScanning(true);

    // بعد 2.5 ثانية، نفترض أنه تم العثور على باركود
    setTimeout(() => {
      const randomCode = `DEMO-${Math.floor(Math.random() * 1000000)}`;
      console.log('[MockScanner] نتيجة المسح الوهمي:', randomCode);
      
      // الإشارة إلى اكتمال المسح
      setIsScanning(false);
      
      // استدعاء معالج النجاح
      onScan(randomCode);
    }, 2500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (manualCode.trim()) {
      console.log('[MockScanner] تم إدخال الكود يدويا:', manualCode);
      onScan(manualCode);
    }
  };

  // واجهة إدخال الرمز يدويا
  if (showManualInput) {
    return (
      <div className="relative w-full h-full bg-white flex flex-col items-center justify-center p-6">
        <div className="absolute top-3 right-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <BarcodeIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h2 className="text-xl font-semibold mb-2">إدخال الرمز يدويًا</h2>
            <p className="text-gray-500 mb-6">يمكنك إدخال رمز الباركود يدويًا</p>
          </div>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Input
                type="text" 
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="أدخل رمز الباركود"
                className="w-full"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                تأكيد
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowManualInput(false)}
              >
                عودة للمسح
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        {/* إطار المسح */}
        <ScannerFrame 
          isActive={isScanning} 
          cameraActive={true} 
          hasError={false} 
        />
        
        {/* محاكاة الكاميرا */}
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
          {isScanning ? (
            <>
              <Spinner size="lg" className="mb-6" />
              <h3 className="text-xl text-white font-semibold mb-2">جاري مسح الباركود</h3>
              <p className="text-gray-300 text-center max-w-xs">
                هذه محاكاة للمسح في بيئة الويب. في التطبيق الفعلي سيتم استخدام كاميرا الجهاز
              </p>
            </>
          ) : (
            <>
              <BarcodeIcon className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl text-white font-semibold mb-2">تم العثور على باركود!</h3>
            </>
          )}
          
          {/* خط المسح المتحرك */}
          {isScanning && (
            <div className="absolute top-1/2 left-0 right-0 h-px bg-red-500 animate-pulse" />
          )}
        </div>
      </div>
      
      {/* أزرار التحكم */}
      <div className="bg-gray-900 p-4 space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={() => setShowManualInput(true)}
            className="flex-1"
            variant="secondary"
            disabled={isScanning}
          >
            إدخال الكود يدويًا
          </Button>
          
          <Button
            onClick={onClose}
            className="flex-1"
            variant="destructive"
          >
            إلغاء
          </Button>
        </div>
        
        <Button 
          onClick={startMockScan} 
          disabled={isScanning} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري المسح...
            </>
          ) : (
            <>
              <BarcodeIcon className="mr-2 h-4 w-4" />
              مسح جديد
            </>
          )}
        </Button>
      </div>
      
      {/* زر إغلاق */}
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 size-10"
        variant="ghost"
        size="icon"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};
