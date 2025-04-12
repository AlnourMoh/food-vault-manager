
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mock';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RemoveProductForm from '@/components/removeProducts/RemoveProductForm';
import { useRemoveProducts } from '@/hooks/removeProducts/useRemoveProducts';

const RemoveProducts = () => {
  const { restaurants, products } = getMockData();
  const {
    selectedRestaurant,
    selectedProduct,
    quantity,
    reason,
    filteredProducts,
    selectedProductDetails,
    handleRestaurantChange,
    handleProductChange,
    setQuantity,
    setReason,
    handleSubmit
  } = useRemoveProducts(restaurants, products);

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">إخراج المنتجات</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">إخراج منتج من المخزون</CardTitle>
            <CardDescription>اختر المنتج والكمية لإخراجها من المخزون</CardDescription>
          </CardHeader>
          <CardContent>
            <RemoveProductForm
              restaurants={restaurants}
              products={products}
              selectedRestaurant={selectedRestaurant}
              selectedProduct={selectedProduct}
              quantity={quantity}
              reason={reason}
              filteredProducts={filteredProducts}
              selectedProductDetails={selectedProductDetails}
              handleRestaurantChange={handleRestaurantChange}
              handleProductChange={handleProductChange}
              setQuantity={setQuantity}
              setReason={setReason}
              handleSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RemoveProducts;
