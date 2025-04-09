
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Barcode, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductActionsProps {
  productId: string;
  isRestaurantRoute: boolean;
  onDeleteClick: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ 
  productId, 
  isRestaurantRoute, 
  onDeleteClick 
}) => {
  const navigate = useNavigate();
  
  const viewBarcodes = (productId: string) => {
    const barcodesPath = isRestaurantRoute 
      ? `/restaurant/products/${productId}/barcodes` 
      : `/products/${productId}/barcodes`;
    navigate(barcodesPath);
  };

  const editProduct = (productId: string) => {
    const editPath = isRestaurantRoute 
      ? `/restaurant/products/${productId}/edit` 
      : `/products/${productId}/edit`;
    navigate(editPath);
  };

  return (
    <div className="mt-4 pt-3 border-t flex justify-between">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDeleteClick}
          className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5 ml-1.5" /> حذف
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => editProduct(productId)}
          className="text-xs hover:bg-primary/10"
        >
          <Edit className="h-3.5 w-3.5 ml-1.5" /> تعديل
        </Button>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => viewBarcodes(productId)}
        className="text-xs hover:bg-fvm-primary hover:text-white"
      >
        <Barcode className="h-3.5 w-3.5 ml-1.5" /> عرض الباركود
      </Button>
    </div>
  );
};
