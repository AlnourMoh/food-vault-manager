
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List } from 'lucide-react';

interface InventoryTabHeaderProps {
  activeDataTab: string;
  onTabChange: (tab: string) => void;
}

const InventoryTabHeader: React.FC<InventoryTabHeaderProps> = ({ 
  activeDataTab, 
  onTabChange 
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <CardTitle className="text-lg">بيانات المخزون</CardTitle>
      <TabsList className="h-9">
        <TabsTrigger 
          value="products" 
          onClick={() => onTabChange('products')}
          className={activeDataTab === 'products' ? "bg-background text-foreground" : ""}
        >
          <LayoutDashboard className="h-4 w-4 ml-2" />
          آخر المنتجات المضافة
        </TabsTrigger>
        <TabsTrigger 
          value="movements" 
          onClick={() => onTabChange('movements')}
          className={activeDataTab === 'movements' ? "bg-background text-foreground" : ""}
        >
          <List className="h-4 w-4 ml-2" />
          آخر الحركات
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default InventoryTabHeader;
