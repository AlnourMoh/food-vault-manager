
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
    icon: JSX.Element;
  };
  getExpiredCount: () => number;
  getExpiringCount: () => number;
  filteredProducts: Product[];
}

const ProductTabs = ({
  products,
  activeTab,
  onTabChange,
  getExpiryStatus,
  getExpiredCount,
  getExpiringCount,
  filteredProducts
}: ProductTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">الكل ({products.length})</TabsTrigger>
        <TabsTrigger value="expiring">
          قاربت على الانتهاء ({getExpiringCount()})
        </TabsTrigger>
        <TabsTrigger value="expired">
          منتهية ({getExpiredCount()})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-4 space-y-4">
        <ProductList products={filteredProducts} getExpiryStatus={getExpiryStatus} />
      </TabsContent>
      
      <TabsContent value="expiring" className="mt-4 space-y-4">
        <ProductList products={filteredProducts} getExpiryStatus={getExpiryStatus} />
      </TabsContent>
      
      <TabsContent value="expired" className="mt-4 space-y-4">
        <ProductList products={filteredProducts} getExpiryStatus={getExpiryStatus} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
