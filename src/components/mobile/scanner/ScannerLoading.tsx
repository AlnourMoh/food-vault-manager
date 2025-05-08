
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerLoadingProps {
  onClose?: () => void;
}

export const ScannerLoading: React.FC<ScannerLoadingProps> = ({ onClose }) => {
  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center h-60">
        {onClose && (
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-60 mt-2" />
      </div>
    </Card>
  );
};
