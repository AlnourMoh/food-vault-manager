
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UnauthorizedAccessCardProps {
  onClose: () => void;
}

const UnauthorizedAccessCard: React.FC<UnauthorizedAccessCardProps> = ({ onClose }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg text-red-600">غير مصرح</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-center">لا تملك صلاحية تسجيل منتجات جديدة. هذه الوظيفة متاحة فقط لفريق إدارة النظام.</p>
      </CardContent>
    </Card>
  );
};

export default UnauthorizedAccessCard;
