
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export class AppSettingsOpener {
  /**
   * Open the app settings to allow the user to manually grant permissions
   */
  public static async openAppSettings(): Promise<boolean> {
    try {
      console.log('AppSettingsOpener: Attempting to open app settings');
      
      const platform = Capacitor.getPlatform();
      console.log('Current platform:', platform);
      
      if (platform === 'android') {
        try {
          await Toast.show({
            text: 'Opening app settings. Please enable camera permission',
            duration: 'short'
          });
          
          // For Android, try to open app-specific settings
          await Browser.open({ 
            url: 'app-settings:',
            windowName: '_system'
          });
          return true;
        } catch (error) {
          console.error('Failed to open Android settings:', error);
          
          await Toast.show({
            text: 'Please open Settings > Apps > Food Vault > Permissions and enable Camera',
            duration: 'long'
          });
          return false;
        }
      } else if (platform === 'ios') {
        try {
          await Toast.show({
            text: 'Opening app settings. Please enable camera permission',
            duration: 'short'
          });
          
          await Browser.open({ 
            url: 'app-settings:',
            windowName: '_system'
          });
          return true;
        } catch (error) {
          console.error('Failed to open iOS settings:', error);
          
          await Toast.show({
            text: 'Please open Settings > Food Vault > Camera and enable the permission',
            duration: 'long'
          });
          return false;
        }
      } else {
        console.log('Cannot open app settings in web environment');
        await Toast.show({
          text: 'Please enable camera permission in your browser settings',
          duration: 'short'
        });
        return false;
      }
    } catch (error) {
      console.error('AppSettingsOpener: Error opening settings:', error);
      await Toast.show({
        text: 'Could not open settings. Please manually enable camera permission',
        duration: 'long'
      });
      return false;
    }
  }
}
