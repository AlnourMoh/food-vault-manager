
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
      <TabsTrigger 
        value="overview" 
        onClick={() => onTabChange('overview')}
      >
        نظرة عامة
      </TabsTrigger>
      <TabsTrigger 
        value="inventory" 
        onClick={() => onTabChange('inventory')}
      >
        المخزون
      </TabsTrigger>
      <TabsTrigger 
        value="reports" 
        onClick={() => onTabChange('reports')}
      >
        التقارير
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange('settings')}
      >
        الإعدادات
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabs;
