
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backPath: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-1" 
        onClick={() => navigate(backPath)}
      >
        <ArrowRight className="h-4 w-4" />
        <span>رجوع</span>
      </Button>
      <h1 className="text-xl font-bold tracking-tight flex-1 text-center">{title}</h1>
      <div className="w-20"></div> {/* للموازنة */}
    </div>
  );
};

export default PageHeader;
