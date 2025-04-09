
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { generateBarcodeImage } from '@/utils/barcodeUtils';

interface BarcodeCardProps {
  barcode: {
    id: string;
    product_id: string;
    qr_code: string;
    is_used: boolean;
  };
  productName: string;
  onPrintSingle?: (barcodeId: string) => void;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ 
  barcode, 
  productName,
  onPrintSingle 
}) => {
  return (
    <Card className="print:border-2 print:shadow-none barcode-card">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-full text-center py-2 border-b mb-2 product-name">
          {productName}
        </div>
        <div className="text-lg font-mono my-2 text-center overflow-hidden barcode-number">
          {barcode.qr_code}
        </div>
        <div className="border-2 border-black w-full h-20 flex items-center justify-center my-2 barcode-image">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: generateBarcodeImage(barcode.qr_code) 
            }} 
            className="w-full h-full flex items-center justify-center" 
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 product-id">
          رقم المنتج: {barcode.product_id.substring(0, 8)}
        </div>
        
        {/* زر طباعة خاص بكل باركود */}
        {onPrintSingle && (
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 w-full print-hidden"
            onClick={() => onPrintSingle(barcode.id)}
          >
            <Printer className="h-4 w-4 ml-2" /> طباعة هذا الباركود
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BarcodeCard;
