
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateBarcodeImage } from '@/utils/barcodeUtils';

interface BarcodeCardProps {
  barcode: {
    id: string;
    product_id: string;
    qr_code: string;
    is_used: boolean;
  };
  productName: string;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ barcode, productName }) => {
  return (
    <Card className="print:border-2 print:shadow-none">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-full text-center py-2 border-b mb-2">
          {productName}
        </div>
        <div className="text-lg font-mono my-2 text-center overflow-hidden">
          {barcode.qr_code}
        </div>
        <div className="border-2 border-black w-full h-20 flex items-center justify-center my-2">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: generateBarcodeImage(barcode.qr_code) 
            }} 
            className="w-full h-full" 
          />
        </div>
        <div className="text-xs text-gray-500 mt-2">
          رقم المنتج: {barcode.product_id.substring(0, 8)}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeCard;
