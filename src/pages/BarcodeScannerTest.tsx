
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SimpleBarcodeScanner from '@/components/scanner/SimpleBarcodeScanner';
import { QrCode, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BarcodeScannerTest = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleScan = (code: string) => {
    setShowScanner(false);
    setLastScannedCode(code);
    
    toast({
      title: "تم المسح بنجاح",
      description: `تم مسح الرمز: ${code}`
    });
  };
  
  const handleOpenScanner = () => {
    setShowScanner(true);
  };
  
  const handleCloseScanner = () => {
    setShowScanner(false);
  };
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container py-6 space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">اختبار قارئ الباركود</h1>
        </div>
      </div>
      
      {/* بطاقة الإجراءات */}
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <QrCode className="w-16 h-16 text-primary" />
          <h2 className="text-xl font-bold">قارئ الباركود</h2>
          <p className="text-center text-gray-600">
            قم باختبار قارئ الباركود للتأكد من عمله بشكل صحيح. اضغط على الزر أدناه لبدء المسح.
          </p>
          <Button onClick={handleOpenScanner} className="w-full">فتح قارئ الباركود</Button>
        </div>
      </Card>
      
      {/* عرض نتائج المسح */}
      {lastScannedCode && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">آخر رمز تم مسحه:</h2>
            <p className="p-3 bg-white border rounded-md text-center font-mono break-all">
              {lastScannedCode}
            </p>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleOpenScanner} className="flex-1">مسح رمز آخر</Button>
              <Button 
                variant="outline" 
                onClick={() => setLastScannedCode(null)} 
                className="flex-1"
              >
                مسح النتيجة
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* عرض الماسح */}
      {showScanner && (
        <SimpleBarcodeScanner 
          onScan={handleScan}
          onClose={handleCloseScanner}
          autoStart={true}
        />
      )}
    </div>
  );
};

export default BarcodeScannerTest;
