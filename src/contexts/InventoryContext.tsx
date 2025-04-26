
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Product } from '@/types';

interface InventoryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  filteredProducts: Product[];
  categories: string[];
  setProducts: (products: Product[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // استخراج الفئات الفريدة من المنتجات
  const categories = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    console.log('Extracting categories from products:', products);
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  // تصفية المنتجات حسب البحث والفئة
  const filteredProducts = useMemo(() => {
    console.log('Filtering products:', products, 'with query:', searchQuery, 'and category:', selectedCategory);
    if (!products || products.length === 0) {
      return [];
    }
    
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // تعيين المنتجات مع طباعة سجلات مفصلة للتصحيح
  const setProductsWithLog = useCallback((newProducts: Product[]) => {
    console.log('Setting inventory products:', newProducts);
    setProducts(newProducts);
  }, []);

  const value = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categories,
    setProducts: setProductsWithLog
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
