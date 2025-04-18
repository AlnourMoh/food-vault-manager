
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface NoPermissionViewProps {
  onClose: () => void;
}

export const NoPermissionView = ({ onClose }: NoPermissionViewProps) => {
  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center h-60">
        <Camera className="text-destructive h-16 w-16 mb-4" />
        <h3 className="text-xl font-bold mb-2">لا يوجد إذن للكاميرا</h3>
        <p className="text-center text-muted-foreground mb-4">
          يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
        </p>
        <Button variant="outline" onClick={onClose}>إغلاق</Button>
      </div>
    </Card>
  );
};
