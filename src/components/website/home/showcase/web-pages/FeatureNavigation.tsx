
import React from 'react';
import { Button } from '@/components/ui/button';

interface FeatureNavigationProps {
  features: string[];
  currentPage: number;
  onPageChange: (index: number) => void;
}

const FeatureNavigation = ({ features, currentPage, onPageChange }: FeatureNavigationProps) => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-w-[200px]">
      {features.map((feature, index) => (
        <Button
          key={index}
          variant={currentPage === index ? "default" : "outline"}
          onClick={() => onPageChange(index)}
          size="sm"
          className="text-right justify-start py-1 text-xs"
        >
          {feature}
        </Button>
      ))}
    </div>
  );
};

export default FeatureNavigation;
