
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanBarcode, Loader2, Lock } from 'lucide-react';

interface InitialScanCardProps {
  onOpenScanner: () => void;
  isLoading: boolean;
  hasPermission?: boolean | null;
}

export const InitialScanCard: React.FC<InitialScanCardProps> = ({ 
  onOpenScanner, 
  isLoading,
  hasPermission
}) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            {hasPermission === false ? (
              <Lock className="h-8 w-8 text-primary" />
            ) : (
              <ScanBarcode className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <h3 className="text-xl font-bold">مسح باركود المنتج</h3>
          
          <p className="text-muted-foreground">
            {hasPermission === false 
              ? "تحتاج إلى منح إذن الكاميرا قبل استخدام الماسح الضوئي" 
              : "قم بمسح الباركود الموجود على المنتج للتحقق من معلوماته"
            }
          </p>
          
          <Button 
            onClick={onOpenScanner}
            className="w-full"
            disabled={isLoading || hasPermission === false}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ScanBarcode className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'جاري التحضير...' : 'مسح الباركود'}
          </Button>
          
          {hasPermission === false && (
            <p className="text-xs text-muted-foreground">
              يرجى منح إذن الوصول إلى الكاميرا من خلال الأزرار أعلاه للاستمرار
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
