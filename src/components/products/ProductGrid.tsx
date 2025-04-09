
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton key={index} />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isRestaurantRoute={isRestaurantRoute} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;
