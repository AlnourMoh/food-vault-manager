
import React from 'react';
import ProductInfo from '@/components/mobile/ProductInfo';
import ProductSubmitButton from '@/components/mobile/ProductSubmitButton';

interface ProductEntryFormProps {
  productInfo: any;
  quantity: string;
  handleQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
  isAddForm: boolean;
}

const ProductEntryForm: React.FC<ProductEntryFormProps> = ({
  productInfo,
  quantity,
  handleQuantityChange,
  handleSubmit,
  loading,
  isAddForm
}) => {
  if (!productInfo) return null;
  
  const action = isAddForm ? "إضافة" : "إخراج";
  const buttonLabel = isAddForm ? "تأكيد إدخال المنتج" : "تأكيد إخراج المنتج";
  const isButtonDisabled = loading || (!isAddForm && (productInfo?.quantity === 0));
  
  return (
    <>
      <ProductInfo 
        productInfo={productInfo}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        action={action}
        showMaxQuantity={!isAddForm}
      />
      
      <ProductSubmitButton 
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        label={buttonLabel}
      />
    </>
  );
};

export default ProductEntryForm;
