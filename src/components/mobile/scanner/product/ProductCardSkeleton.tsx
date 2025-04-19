
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="py-6 space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-40 w-40 rounded-md" />
        </div>
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
