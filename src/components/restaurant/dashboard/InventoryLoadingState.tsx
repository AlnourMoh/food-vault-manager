
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const InventoryLoadingState: React.FC = () => {
  return (
    <div className="p-4">
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryLoadingState;
