
import React, { useState } from 'react';
import HomePage from './mobile-pages/HomePage';
import ScanPage from './mobile-pages/ScanPage';
import InventoryPage from './mobile-pages/InventoryPage';
import AddProductPage from './mobile-pages/AddProductPage';
import FeatureNavigation from './web-pages/FeatureNavigation';

const MobileShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    <HomePage key="home" />,
    <ScanPage key="scan" />,
    <InventoryPage key="inventory" />,
    <AddProductPage key="add-product" />
  ];

  const features = [
    "مسح المنتجات بالباركود",
    "تحديث المخزون فورياً",
    "عرض تنبيهات انتهاء الصلاحية",
    "إضافة وتعديل المنتجات",
    "عرض تقارير سريعة"
  ];

  return (
    <div className="relative w-full h-full">
      <FeatureNavigation 
        features={features}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        position="right"
      />
      {pages[currentPage]}
    </div>
  );
};

export default MobileShowcase;
