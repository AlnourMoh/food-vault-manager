
import React from 'react';

interface NavigationDotsProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ 
  totalPages, 
  currentPage, 
  onPageChange 
}) => {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
      {Array.from({ length: totalPages }).map((_, idx) => (
        <button
          key={idx}
          className={`w-2 h-2 rounded-full ${currentPage === idx ? 'bg-primary' : 'bg-gray-300'}`}
          onClick={() => onPageChange(idx)}
        />
      ))}
    </div>
  );
};

export default NavigationDots;
