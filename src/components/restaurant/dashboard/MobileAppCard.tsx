
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scan } from 'lucide-react';

const MobileAppCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium">تطبيق فريق المخزن</h3>
        <p className="text-sm text-muted-foreground mb-4">
          استخدم تطبيق فريق المخزن على جهازك المحمول لإدارة المخزون بسهولة.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/restaurant/mobile')} 
            className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
          >
            <Scan className="h-4 w-4" />
            <span>فتح تطبيق فريق المخزن</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileAppCard;
