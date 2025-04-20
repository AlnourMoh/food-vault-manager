
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FeatureNavigationProps {
  features: string[];
  currentPage: number;
  onPageChange: (index: number) => void;
  position?: 'left' | 'right';
}

const FeatureNavigation = ({ 
  features, 
  currentPage, 
  onPageChange,
  position = 'left'
}: FeatureNavigationProps) => {
  return (
    <div className={`absolute ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-w-[200px]`}>
      {features.map((feature, index) => (
        <Button
          key={index}
          variant={currentPage === index ? "default" : "outline"}
          onClick={() => onPageChange(index)}
          size="sm"
          className={`text-right justify-start py-1 text-xs ${position === 'right' ? 'flex-row-reverse' : ''}`}
        >
          {feature}
          {position === 'right' && currentPage === index && <ArrowLeft className="mr-auto h-3.5 w-3.5" />}
        </Button>
      ))}
    </div>
  );
};

export default FeatureNavigation;
