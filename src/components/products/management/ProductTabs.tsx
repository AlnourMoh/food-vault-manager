
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types';
import ProductList from './ProductList';

interface ProductTabsProps {
  products: Product[];
  activeTab: string;
  onTabChange: (value: string) => void;
  getExpiryStatus: (expiryDate: Date) => {
    label: string;
    variant: "default" | "destructive" | "warning";
    icon: { type: string; className: string };
  };
  getExpiredCount: () => number;
  filteredProducts: Product[];
}

const ProductTabs = ({
  products,
  activeTab,
  onTabChange,
  getExpiryStatus,
  getExpiredCount,
  filteredProducts
}: ProductTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all">الكل ({products.length})</TabsTrigger>
        <TabsTrigger value="expired">
          منتهية ({getExpiredCount()})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4 space-y-4">
        <ProductList products={filteredProducts} getExpiryStatus={getExpiryStatus} />
      </TabsContent>
      
      <TabsContent value="expired" className="mt-4 space-y-4">
        <ProductList products={filteredProducts} getExpiryStatus={getExpiryStatus} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
