
import { AppSettingsOpener } from '@/services/scanner/permission/AppSettingsOpener';

export const useAppSettings = () => {
  const openAppSettings = async (): Promise<boolean> => {
    return await AppSettingsOpener.openAppSettings();
  };

  return {
    openAppSettings
  };
};
