
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { BuildingIcon, Users, ShoppingCart, BarChartIcon } from 'lucide-react';
import { DashboardData } from '@/types';

interface StatsGridProps {
  dashboardData: DashboardData | null;
}

const StatsGrid: React.FC<StatsGridProps> = ({ dashboardData }) => {
  const stats = [
    {
      title: "المطاعم",
      value: dashboardData ? dashboardData.restaurants.length : "0",
      icon: <BuildingIcon className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50",
      description: "إجمالي عدد المطاعم المسجلة",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "المستخدمين",
      value: dashboardData ? dashboardData.storageTeamMembers.length : "0",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50",
      description: "إجمالي عدد المستخدمين",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "المنتجات",
      value: dashboardData ? dashboardData.products.length : "0",
      icon: <ShoppingCart className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50",
      description: "إجمالي عدد المنتجات",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "المعاملات",
      value: dashboardData ? dashboardData.inventoryTransactions.length : "0",
      icon: <BarChartIcon className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50",
      description: "إجمالي عدد المعاملات",
      trend: { value: 3, isPositive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          trend={stat.trend}
          className={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;

