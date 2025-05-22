
import { Camera } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { AppSettingsOpener } from './AppSettingsOpener';

export class CameraPermissionRequester {
  private permissionAttempts = 0;
  
  /**
   * Request camera permission
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('CameraPermissionRequester: Requesting camera permission');
      this.permissionAttempts++;
      
      // Check for maximum number of attempts to avoid annoying repeated requests
      if (this.permissionAttempts > 2) {
        console.log('CameraPermissionRequester: Exceeded maximum permission request attempts');
        // Try to open app settings to get permission manually
        await Toast.show({
          text: 'You will be directed to app settings to enable camera permission manually',
          duration: 'short'
        });
        return await AppSettingsOpener.openAppSettings();
      }
      
      // In case of web environment, request permission from the browser
      if (!Capacitor.isNativePlatform()) {
        console.log('CameraPermissionRequester: We are in web environment, using web API');
        
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            // Show explanation to user
            await Toast.show({
              text: 'The browser will ask you to allow camera access. Please accept to enable scanning',
              duration: 'long'
            });
            
            // Try to access the camera directly
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: {
                facingMode: 'environment' // Use the rear camera if possible
              } 
            });
            
            // Close the stream immediately as we only need to check permission
            stream.getTracks().forEach(track => track.stop());
            console.log('CameraPermissionRequester: Browser camera permission granted successfully');
            
            await Toast.show({
              text: 'Camera permission granted successfully',
              duration: 'short'
            });
            
            return true;
          } catch (error) {
            console.log('CameraPermissionRequester: Browser camera permission denied:', error);
            
            await Toast.show({
              text: 'Camera permission denied. Please allow access from browser settings',
              duration: 'short'
            });
            
            return false;
          }
        }
        
        console.log('CameraPermissionRequester: Browser does not support getUserMedia, camera cannot be used');
        return false;
      }
      
      // Determine platform to customize experience
      const platform = Capacitor.getPlatform();
      console.log(`CameraPermissionRequester: Current platform: ${platform}`);
      
      // On mobile devices
      // Check for MLKit availability first
      if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
        console.log('CameraPermissionRequester: Using MLKitBarcodeScanner for permission');
        
        try {
          // Show explanation to user
          await Toast.show({
            text: 'The app will request camera permission for barcode scanning',
            duration: 'short'
          });
          
          const result = await BarcodeScanner.requestPermissions();
          console.log('MLKit permission request result:', result);
          
          if (result.camera === 'granted') {
            await Toast.show({
              text: 'Camera permission granted successfully',
              duration: 'short'
            });
            return true;
          } else if (result.camera === 'denied') {
            console.log('MLKit permission denied, trying to open settings');
            
            await Toast.show({
              text: 'Camera permission denied. You will be directed to settings',
              duration: 'short'
            });
            
            // Escalation strategy after first rejection
            if (this.permissionAttempts > 1) {
              return await AppSettingsOpener.openAppSettings();
            }
          }
        } catch (mlkitError) {
          console.error('Error requesting MLKit permissions:', mlkitError);
          // Continue to next method
        }
      }
      
      // Use Camera plugin as fallback
      if (Capacitor.isPluginAvailable('Camera')) {
        console.log('CameraPermissionRequester: Using Camera for permission');
        try {
          // Show explanation to user
          await Toast.show({
            text: 'The app will request camera permission for barcode scanning',
            duration: 'short'
          });
          
          const result = await Camera.requestPermissions({
            permissions: ['camera']
          });
          
          console.log('Camera permission request result:', result);
          
          if (result.camera === 'granted') {
            await Toast.show({
              text: 'Camera permission granted successfully',
              duration: 'short'
            });
            return true;
          } else if (result.camera === 'denied') {
            console.log('Camera permission denied, trying to open settings');
            
            await Toast.show({
              text: 'Camera permission denied. You will be directed to settings',
              duration: 'short'
            });
            
            // Escalation strategy after first rejection
            if (this.permissionAttempts > 1) {
              return await AppSettingsOpener.openAppSettings();
            }
          }
        } catch (cameraError) {
          console.error('Error requesting Camera permissions:', cameraError);
        }
      }
      
      // If no plugin is available, open settings
      console.warn('CameraPermissionRequester: No plugin available to request camera permission, trying to open settings');
      return await AppSettingsOpener.openAppSettings();
    } catch (error) {
      console.error('CameraPermissionRequester: Error requesting permission:', error);
      return false;
    }
  }
}
