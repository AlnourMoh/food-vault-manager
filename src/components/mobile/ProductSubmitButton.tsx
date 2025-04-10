
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ProductSubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  label?: string;
}

const ProductSubmitButton: React.FC<ProductSubmitButtonProps> = ({
  onClick,
  disabled,
  label = "تأكيد إدخال المنتج"
}) => {
  return (
    <Button 
      className="w-full bg-green-600 hover:bg-green-700"
      onClick={onClick}
      disabled={disabled}
    >
      <Check className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

export default ProductSubmitButton;
