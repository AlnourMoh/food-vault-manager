
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BarcodePageHeaderProps {
  productName: string;
  barcodeCount: number;
  handlePrint: () => void;
}

const BarcodePageHeader: React.FC<BarcodePageHeaderProps> = ({ 
  productName, 
  barcodeCount, 
  handlePrint 
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
      </div>
    </>
  );
};

export default BarcodePageHeader;
