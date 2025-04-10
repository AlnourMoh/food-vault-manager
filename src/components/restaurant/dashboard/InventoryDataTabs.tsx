
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useInventoryData } from './useInventoryData';
import ProductsTable from './ProductsTable';
import MovementsTable from './MovementsTable';
import InventoryLoadingState from './InventoryLoadingState';
import InventoryTabHeader from './InventoryTabHeader';

const InventoryDataTabs: React.FC = React.memo(() => {
  const [activeDataTab, setActiveDataTab] = useState('products');
  const { 
    recentProducts, 
    recentMovements, 
    productsPagination, 
    movementsPagination,
    productsSort,
    movementsSort,
    loading,
    handleProductPageChange,
    handleMovementPageChange,
    handleProductsSort,
    handleMovementsSort
  } = useInventoryData(activeDataTab);
  
  const handleTabChange = useCallback((tab: string) => {
    setActiveDataTab(tab);
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <InventoryTabHeader 
          activeDataTab={activeDataTab} 
          onTabChange={handleTabChange}
        />
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <InventoryLoadingState />
        ) : (
          <>
            {activeDataTab === 'products' ? (
              <ProductsTable 
                products={recentProducts} 
                pagination={productsPagination}
                sort={productsSort}
                onPageChange={handleProductPageChange}
                onSortChange={handleProductsSort}
              />
            ) : (
              <MovementsTable 
                movements={recentMovements} 
                pagination={movementsPagination}
                sort={movementsSort}
                onPageChange={handleMovementPageChange}
                onSortChange={handleMovementsSort}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

InventoryDataTabs.displayName = 'InventoryDataTabs';

export default InventoryDataTabs;
