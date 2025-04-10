
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Package, BarChart2, Settings } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 mb-4">
      <TabsTrigger 
        value="overview" 
        onClick={() => onTabChange('overview')}
        className="flex items-center gap-2"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden md:inline">نظرة عامة</span>
        <span className="inline md:hidden">عامة</span>
      </TabsTrigger>
      <TabsTrigger 
        value="inventory" 
        onClick={() => onTabChange('inventory')}
        className="flex items-center gap-2"
      >
        <Package className="h-4 w-4" />
        <span className="hidden md:inline">المخزون</span>
        <span className="inline md:hidden">المخزون</span>
      </TabsTrigger>
      <TabsTrigger 
        value="reports" 
        onClick={() => onTabChange('reports')}
        className="flex items-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        <span className="hidden md:inline">التقارير</span>
        <span className="inline md:hidden">تقارير</span>
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange('settings')}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden md:inline">الإعدادات</span>
        <span className="inline md:hidden">إعدادات</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabs;
