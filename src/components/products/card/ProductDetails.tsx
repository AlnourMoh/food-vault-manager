
import React from 'react';
import { format } from 'date-fns';

interface ProductDetailsProps {
  name: string;
  category: string;
  quantity: number;
  expiryDate: Date;
  id: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  name, 
  category, 
  quantity, 
  expiryDate, 
  id 
}) => {
  // Format date in Gregorian format (DD/MM/YYYY)
  const formatDate = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg text-fvm-primary mb-2">{name}</h3>
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">التصنيف:</span> 
          <span className="text-gray-800">{category}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">الكمية:</span> 
          <span className="text-gray-800">{quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">تاريخ الانتهاء:</span>
          <span className={`${new Date(expiryDate) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(new Date(expiryDate))}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">رقم المنتج:</span>
          <span className="text-gray-800 font-mono text-xs">{id.substring(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};
