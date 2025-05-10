
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';

export const useScannerPermissions = () => {
  const checkPermission = async (): Promise<boolean> => {
    console.log('useScannerPermissions: التحقق من وجود إذن الكاميرا');
    return await scannerPermissionService.checkPermission();
  };
  
  const requestPermission = async (): Promise<boolean> => {
    console.log('useScannerPermissions: طلب إذن الكاميرا');
    return await scannerPermissionService.requestPermission();
  };
  
  const openAppSettings = async (): Promise<boolean> => {
    console.log('useScannerPermissions: فتح إعدادات التطبيق');
    return await scannerPermissionService.openAppSettings();
  };
  
  const isSupported = async (): Promise<boolean> => {
    console.log('useScannerPermissions: التحقق من دعم الماسح الضوئي');
    return await scannerPermissionService.isSupported();
  };
  
  return {
    checkPermission,
    requestPermission,
    openAppSettings,
    isSupported
  };
};
