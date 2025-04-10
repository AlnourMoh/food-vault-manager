
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useInventoryData } from './useInventoryData';
import ProductsTable from './ProductsTable';
import MovementsTable from './MovementsTable';
import InventoryLoadingState from './InventoryLoadingState';
import InventoryTabHeader from './InventoryTabHeader';

const InventoryDataTabs: React.FC = () => {
  const [activeDataTab, setActiveDataTab] = useState('products');
  const { recentProducts, recentMovements, loading } = useInventoryData(activeDataTab);
  
  const handleTabChange = (tab: string) => {
    setActiveDataTab(tab);
  };
  
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
              <ProductsTable products={recentProducts} />
            ) : (
              <MovementsTable movements={recentMovements} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryDataTabs;
