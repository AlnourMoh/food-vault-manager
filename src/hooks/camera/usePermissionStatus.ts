
import { useState } from 'react';

export const usePermissionStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);

  return {
    isLoading,
    setIsLoading,
    hasPermission,
    setHasPermission,
    permissionDeniedCount,
    setPermissionDeniedCount
  };
};
