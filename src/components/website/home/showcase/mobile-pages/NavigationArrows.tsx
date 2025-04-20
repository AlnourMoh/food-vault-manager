
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({ onPrevious, onNext }) => {
  return (
    <div className="absolute bottom-2 right-2 flex gap-2">
      <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={onPrevious}>
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={onNext}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NavigationArrows;
