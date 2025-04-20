
import React, { useState } from 'react';
import HomePage from './mobile-pages/HomePage';
import ScanPage from './mobile-pages/ScanPage';
import InventoryPage from './mobile-pages/InventoryPage';
import AddProductPage from './mobile-pages/AddProductPage';
import NavigationDots from './mobile-pages/NavigationDots';
import NavigationArrows from './mobile-pages/NavigationArrows';

const MobileShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    <HomePage key="home" />,
    <ScanPage key="scan" />,
    <InventoryPage key="inventory" />,
    <AddProductPage key="add-product" />
  ];

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full">
      {pages[currentPage]}
      
      <NavigationDots
        totalPages={pages.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <NavigationArrows
        onPrevious={goToPrevPage}
        onNext={goToNextPage}
      />
    </div>
  );
};

export default MobileShowcase;
