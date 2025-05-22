
/**
 * Scanner permission service
 */
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { platformService } from './PlatformService';

class ScannerPermissionService {
  private permissionRequestCount = 0;
  
  /**
   * Check if device supports scanner
   */
  public async isSupported(): Promise<boolean> {
    try {
      // First check if we're in a native platform
      if (!platformService.isNativePlatform()) {
        console.warn('[ScannerPermissionService] We are in a browser environment, scanner is not supported');
        return false;
      }
      
      // Log information about platform and plugin availability
      console.log(`[ScannerPermissionService] Platform: ${platformService.getPlatform()}`);
      console.log(`[ScannerPermissionService] MLKitBarcodeScanner: ${platformService.isPluginAvailable('MLKitBarcodeScanner')}`);
      console.log(`[ScannerPermissionService] Camera: ${platformService.isPluginAvailable('Camera')}`);
      
      // Check if barcode scanner plugin is supported
      if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
        try {
          const result = await BarcodeScanner.isSupported();
          console.log('[ScannerPermissionService] isSupported result from BarcodeScanner:', result);
          return result.supported;
        } catch (error) {
          console.error('[ScannerPermissionService] Error checking BarcodeScanner support:', error);
        }
      }

      // As a fallback, check if getUserMedia is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Check for video input devices
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasVideoInput = devices.some(device => device.kind === 'videoinput');
          
          if (hasVideoInput) {
            console.log('[ScannerPermissionService] Camera detected using enumerateDevices');
            return true;
          } else {
            console.warn('[ScannerPermissionService] No cameras available on this device');
          }
        } catch (error) {
          console.error('[ScannerPermissionService] Error using enumerateDevices:', error);
        }
      } else {
        console.warn('[ScannerPermissionService] getUserMedia not supported in this browser');
      }
      
      // On mobile, assume camera exists even if we can't verify it
      if (platformService.isNativePlatform()) {
        console.log('[ScannerPermissionService] On mobile, assuming camera support');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ScannerPermissionService] Error checking support:', error);
      // In case of error on mobile, assume support as a fallback
      return platformService.isNativePlatform();
    }
  }

  /**
   * Check camera permission without requesting it
   */
  public async checkPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] Checking camera permission...');
      
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] Device does not support scanning');
        return false;
      }
      
      // In native app environment
      if (platformService.isNativePlatform()) {
        // Try BarcodeScanner first
        if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] Checking permission using MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          console.log('[ScannerPermissionService] MLKitBarcodeScanner permission status:', status);
          
          // Show permission status to user
          await Toast.show({
            text: `Camera permission status: ${status.camera}`,
            duration: 'short'
          });
          
          return status.camera === 'granted';
        }
        
        // Use standard Camera plugin
        if (platformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] Checking permission using Camera');
          const status = await Camera.checkPermissions();
          console.log('[ScannerPermissionService] Camera permission status:', status);
          
          // Show permission status to user
          await Toast.show({
            text: `Camera permission status: ${status.camera}`,
            duration: 'short'
          });
          
          return status.camera === 'granted';
        }
        
        console.warn('[ScannerPermissionService] No plugin available to check permission');
        return false;
      }
      
      // In browser environment, check for camera access
      // but don't actually access it to avoid triggering permission popup
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // If there are video devices, we might have permission or it might not have been requested yet
        // We can't accurately know permission state without trying to access the camera
        return videoDevices.length > 0;
      } catch (error) {
        console.error('[ScannerPermissionService] Error checking video devices:', error);
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] Error checking camera permission:', error);
      return false;
    }
  }
  
  /**
   * Request camera permission
   */
  public async requestPermission(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] Requesting camera permission...');
      
      if (!await this.isSupported()) {
        console.warn('[ScannerPermissionService] Device does not support scanning');
        return false;
      }

      // Increment permission request counter
      this.permissionRequestCount++;
      console.log(`[ScannerPermissionService] Permission request attempt: ${this.permissionRequestCount}`);
      
      // Show message to user before requesting permission
      await Toast.show({
        text: 'App needs camera permission to scan barcodes',
        duration: 'long'
      });
      
      // In native app environment
      if (platformService.isNativePlatform()) {
        // Try BarcodeScanner first
        if (platformService.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('[ScannerPermissionService] Requesting permission using MLKitBarcodeScanner');
          
          try {
            const status = await BarcodeScanner.checkPermissions();
            
            if (status.camera === 'granted') {
              console.log('[ScannerPermissionService] Permission already granted');
              return true;
            }
            
            // Request permission if not already granted
            console.log('[ScannerPermissionService] Requesting permission through MLKitBarcodeScanner.requestPermissions...');
            const result = await BarcodeScanner.requestPermissions();
            console.log('[ScannerPermissionService] Permission request result:', result);
            
            if (result.camera === 'granted') {
              await Toast.show({
                text: 'Camera permission granted successfully',
                duration: 'short'
              });
              return true;
            } else if (result.camera === 'denied') {
              // Open app settings directly after denial
              await Toast.show({
                text: 'Camera permission denied. Opening settings...',
                duration: 'short'
              });
              await this.openAppSettings();
              return false;
            }
          } catch (error) {
            console.error('[ScannerPermissionService] Error requesting permission using MLKitBarcodeScanner:', error);
          }
        }
        
        // Use standard Camera plugin
        if (platformService.isPluginAvailable('Camera')) {
          console.log('[ScannerPermissionService] Requesting permission using Camera');
          
          try {
            const status = await Camera.checkPermissions();
            
            if (status.camera === 'granted') {
              console.log('[ScannerPermissionService] Permission already granted');
              return true;
            }
            
            // Request permission if not already granted
            console.log('[ScannerPermissionService] Requesting permission through Camera.requestPermissions...');
            const result = await Camera.requestPermissions();
            console.log('[ScannerPermissionService] Permission request result:', result);
            
            if (result.camera === 'granted') {
              await Toast.show({
                text: 'Camera permission granted successfully',
                duration: 'short'
              });
              return true;
            } else if (result.camera === 'denied') {
              // Open app settings directly after denial
              await Toast.show({
                text: 'Camera permission denied. Opening settings...',
                duration: 'short'
              });
              await this.openAppSettings();
              return false;
            }
          } catch (error) {
            console.error('[ScannerPermissionService] Error requesting permission using Camera:', error);
          }
        }
        
        // If we reach here and haven't succeeded, try opening app settings
        await Toast.show({
          text: 'Unable to get camera permission. Opening app settings',
          duration: 'short'
        });
        await this.openAppSettings();
        return false;
      }
      
      // In browser environment - try accessing the camera
      try {
        console.log('[ScannerPermissionService] Attempting to access camera in browser...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Success! Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('[ScannerPermissionService] Error accessing camera in browser:', error);
        return false;
      }
    } catch (error) {
      console.error('[ScannerPermissionService] Error requesting camera permission:', error);
      return false;
    }
  }
  
  /**
   * Open app settings
   */
  public async openAppSettings(): Promise<boolean> {
    try {
      console.log('[ScannerPermissionService] Attempting to open app settings...');

      // Check if we're in a native Capacitor app
      if (platformService.isNativePlatform()) {
        // Try using Browser to open settings
        try {
          if (platformService.getPlatform() === 'android') {
            try {
              // Get app info
              const appInfo = await App.getInfo();
              console.log('App info:', appInfo);
              
              // Use Browser.open to open settings on Android
              await Browser.open({
                url: `package:${appInfo.id || 'app.lovable.foodvault.manager'}`
              });
              return true;
            } catch (e) {
              console.error('Error opening specific URL:', e);
              
              // Alternative attempt for Android
              try {
                await Browser.open({ url: 'app-settings:' });
                return true;
              } catch (innerError) {
                console.error('Failed to open general app settings:', innerError);
              }
            }
          } else if (platformService.getPlatform() === 'ios') {
            // For iOS, try to open app settings
            try {
              await Browser.open({ url: 'app-settings:' });
              return true;
            } catch (e) {
              console.error('Error opening app settings on iOS:', e);
            }
          }
        } catch (error) {
          console.error('Error opening app settings:', error);
        }
      }
      
      // If we reach here, tell user to open settings manually
      const platform = platformService.getPlatform();
      const message = platform === 'android' 
        ? 'Please open Settings > Apps > Food Vault > Permissions to enable camera'
        : 'Please open Settings > Privacy > Camera to enable permission for our app';
      
      console.log('Showing manual settings instructions:', message);
      await Toast.show({ text: message, duration: 'long' });
      
      return false;
    } catch (error) {
      console.error('Error opening app settings:', error);
      return false;
    }
  }
}

export const scannerPermissionService = new ScannerPermissionService();
