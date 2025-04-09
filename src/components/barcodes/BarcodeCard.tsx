
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { generateBarcodeImage } from '@/utils/barcodeUtils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Function to handle print button click
  const handlePrintClick = () => {
    if (onPrintSingle) {
      onPrintSingle(barcode.id);
    }
  };
  
  return (
    <Card className="h-full print:border-2 print:shadow-none barcode-card transition-all duration-200 hover:shadow-md">
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-between h-full">
        <div className="w-full text-center py-1 border-b mb-1 product-name font-medium">
          {productName}
        </div>
        
        <div className="border w-full flex-grow flex items-center justify-center my-1 barcode-image p-2">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: generateBarcodeImage(barcode.qr_code) 
            }} 
            className="w-full h-full flex items-center justify-center" 
          />
        </div>
        
        <div className="text-xs text-center font-mono tracking-wide barcode-number">
          {barcode.qr_code}
        </div>
        
        <div className="text-xs text-gray-500 mt-1 product-id">
          رقم المنتج: {barcode.product_id.substring(0, 8)}
        </div>
        
        {/* Print button with responsive sizing */}
        {onPrintSingle && (
          <Button 
            size={isMobile ? "sm" : "default"} 
            variant="outline" 
            className="mt-2 w-full print-hidden"
            onClick={handlePrintClick}
          >
            <Printer className="h-4 w-4 ml-2" /> 
            {isMobile ? "طباعة" : "طباعة هذا الباركود"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BarcodeCard;
