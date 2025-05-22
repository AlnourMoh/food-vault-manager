
import { App } from '@capacitor/app';
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
      const appId = 'app.lovable.foodvault.manager';
      
      if (platform === 'android') {
        // For Android devices
        try {
          // Show message to user
          await Toast.show({
            text: 'Opening app settings. Please enable camera permission',
            duration: 'short'
          });
          
          // Try using Android's app details page
          await Browser.open({ url: `package:${appId}` });
          return true;
        } catch (error) {
          console.error('Failed to open Android settings:', error);
          
          // Fallback for Android - show instructions
          await Toast.show({
            text: 'Please open Settings > Apps > Food Vault > Permissions and enable Camera',
            duration: 'long'
          });
          return false;
        }
      } else if (platform === 'ios') {
        // For iOS devices
        try {
          await Toast.show({
            text: 'Opening app settings. Please enable camera permission',
            duration: 'short'
          });
          
          // Use Browser to open app settings URL for iOS
          await Browser.open({ url: 'app-settings:' });
          return true;
        } catch (error) {
          console.error('Failed to open iOS settings:', error);
          
          // Fallback for iOS - show instructions
          await Toast.show({
            text: 'Please open Settings > Food Vault > Camera and enable the permission',
            duration: 'long'
          });
          return false;
        }
      } else {
        // For web environment
        console.log('Cannot open app settings in web environment');
        await Toast.show({
          text: 'Please enable camera permission in your browser settings',
          duration: 'short'
        });
        return false;
      }
    } catch (error) {
      console.error('AppSettingsOpener: Error opening settings:', error);
      return false;
    }
  }
}
