
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarcodeIcon, QrCode } from 'lucide-react';

interface InitialScanCardProps {
  onOpenScanner: () => void;
  isLoading: boolean;
}

export const InitialScanCard = ({ onOpenScanner, isLoading }: InitialScanCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <BarcodeIcon className="h-5 w-5" />
          <span>مسح باركود المنتج</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <QrCode className="h-16 w-16 text-primary" />
          </div>
          <p className="text-center text-muted-foreground max-w-md">
            قم بمسح باركود المنتج للتحقق من معلوماته مثل تاريخ الإنتاج وتاريخ انتهاء الصلاحية والكمية المتوفرة
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={onOpenScanner}
            className="gap-2"
            disabled={isLoading}
          >
            <BarcodeIcon className="h-4 w-4" />
            {isLoading ? 'جاري البحث...' : 'مسح باركود'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
