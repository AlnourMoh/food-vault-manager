
import React, { useState } from 'react';
import DashboardPage from './web-pages/DashboardPage';
import ProductsPage from './web-pages/ProductsPage';
import InventoryPage from './web-pages/InventoryPage';
import UsersPage from './web-pages/UsersPage';
import FeatureNavigation from './web-pages/FeatureNavigation';

const WebShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    <DashboardPage key="dashboard" />,
    <ProductsPage key="products" />,
    <InventoryPage key="inventory" />,
    <UsersPage key="users" />
  ];

  const features = [
    "لوحة تحكم شاملة لعرض الإحصائيات",
    "إدارة المنتجات والمخزون بكفاءة",
    "تتبع الصلاحية والكميات",
    "تقارير وإحصائيات متقدمة",
    "إدارة المستخدمين والصلاحيات"
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-secondary/30">
      <FeatureNavigation 
        features={features}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {pages[currentPage]}
    </div>
  );
};

export default WebShowcase;
