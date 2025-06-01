
import { useState } from 'react';

export const usePermissionStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission
  };
};
