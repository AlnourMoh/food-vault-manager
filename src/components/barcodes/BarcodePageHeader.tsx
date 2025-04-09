
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LabelSize } from '@/hooks/barcodes/types';

interface BarcodePageHeaderProps {
  productName: string;
  barcodeCount: number;
  handlePrint: () => void;
  selectedLabelSize: LabelSize;
  changeLabelSize: (labelSizeId: string) => void;
  labelSizes: LabelSize[];
}

const BarcodePageHeader: React.FC<BarcodePageHeaderProps> = ({ 
  productName, 
  barcodeCount, 
  handlePrint,
  selectedLabelSize,
  changeLabelSize,
  labelSizes
}) => {
  const navigate = useNavigate();
  
  // Determine current route type
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const inventoryPath = isRestaurantRoute ? '/restaurant/inventory' : '/inventory';

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">باركود المنتج</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(inventoryPath)}
          >
            <ArrowLeft className="h-4 w-4 ml-2" /> العودة للمخزون
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-fvm-primary hover:bg-fvm-primary-light print:hidden"
          >
            <Printer className="h-4 w-4 ml-2" /> طباعة الباركود
          </Button>
        </div>
      </div>
      
      <div className="mb-6 pb-4 border-b print:hidden">
        <h2 className="text-xl font-semibold">{productName}</h2>
        <p className="text-gray-600">عدد الباركود: {barcodeCount}</p>
        
        {/* Barcode Label Size Selector */}
        <div className="mt-4 flex items-center gap-2">
          <p className="text-gray-600">حجم الملصق:</p>
          <Select 
            value={selectedLabelSize.id} 
            onValueChange={changeLabelSize}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="اختر حجم الملصق" />
            </SelectTrigger>
            <SelectContent>
              {labelSizes.map(size => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name} ({size.width}mm × {size.height}mm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default BarcodePageHeader;
