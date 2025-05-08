
import { usePermissionStatus } from './camera/usePermissionStatus';
import { usePermissionCheck } from './camera/usePermissionCheck';
import { usePermissionRequest } from './camera/usePermissionRequest';
import { useAppSettings } from './camera/useAppSettings';

export const useCameraPermissions = () => {
  const permissionStatus = usePermissionStatus();
  const { isLoading, hasPermission } = permissionStatus;
  const { openAppSettings } = useAppSettings();
  const { requestCameraPermission } = usePermissionRequest(permissionStatus);
  
  // Initialize permission check
  usePermissionCheck(permissionStatus);

  return {
    isLoading,
    hasPermission,
    requestPermission: requestCameraPermission,
    openAppSettings
  };
};
