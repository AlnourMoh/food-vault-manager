
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import ProductSkeleton from './ProductSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isRestaurantRoute: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, isRestaurantRoute }) => {
  if (isLoading) {
    return (
      <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-[300px] flex-none">
            <ProductSkeleton />
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium">لا توجد منتجات في المخزون</h3>
        <p className="text-gray-500 mt-2">قم بإضافة منتجات جديدة للبدء</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-nowrap gap-6 overflow-x-auto pb-4">
      {products.map((product) => (
        <div key={product.id} className="w-[300px] flex-none">
          <ProductCard 
            product={product} 
            isRestaurantRoute={isRestaurantRoute} 
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
