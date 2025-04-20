
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import HomePage from './mobile-pages/HomePage';
import ScanPage from './mobile-pages/ScanPage';
import InventoryPage from './mobile-pages/InventoryPage';
import AddProductPage from './mobile-pages/AddProductPage';

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
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-w-[200px]">
        {features.map((feature, index) => (
          <Button
            key={index}
            variant={currentPage === index ? "default" : "outline"}
            onClick={() => setCurrentPage(index)}
            size="sm"
            className="text-right justify-start py-1 text-xs"
          >
            {feature}
          </Button>
        ))}
      </div>
      {pages[currentPage]}
    </div>
  );
};

export default MobileShowcase;
