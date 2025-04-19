
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ProductTabs from '@/components/products/management/ProductTabs';
import SearchBar from '@/components/products/management/SearchBar';
import { useProductManagement } from '@/hooks/products/useProductManagement';

const ProductManagement = () => {
  const navigate = useNavigate();
  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    getExpiryStatus,
  } = useProductManagement();

  return (
    <div className="container py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تتبع وإدارة المنتجات</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ProductTabs
        products={products}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getExpiryStatus={getExpiryStatus}
        filteredProducts={filteredProducts}
      />
    </div>
  );
};

export default ProductManagement;
