
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ScannerLoading = () => {
  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center h-60">
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-60 mt-2" />
      </div>
    </Card>
  );
};
