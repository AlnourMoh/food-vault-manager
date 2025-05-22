
import React, { useEffect, useState } from 'react';
import { useBackButtonHandler } from '@/hooks/mobile/useBackButtonHandler';
import { useNetworkConnectionHandler } from '@/hooks/mobile/useNetworkConnectionHandler';
import { AppRoutes } from './routes/AppRoutes';
import { AuthRoutes } from './routes/AuthRoutes';
import NetworkErrorView from './NetworkErrorView';
import { scannerPermissionService } from '@/services/scanner/ScannerPermissionService';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Browser } from '@capacitor/browser';

const MobileApp: React.FC = () => {
  // Use our custom hooks
  useBackButtonHandler();
  const { networkError, handleRetryConnection } = useNetworkConnectionHandler();
  const [permissionRequested, setPermissionRequested] = useState(false);
  
  // Request camera permission when the app starts
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        console.log('MobileApp: Starting app and requesting camera permission');
        
        // Check if we're in a native app environment
        if (!Capacitor.isNativePlatform()) {
          console.log('MobileApp: Not in native platform');
          return;
        }
        
        // Show a message to the user
        await Toast.show({
          text: 'Checking camera permissions...',
          duration: 'short'
        });
        
        // Check current permission status
        let hasPermission = false;
        
        // Method 1: Use BarcodeScanner if available
        if (Capacitor.isPluginAvailable('MLKitBarcodeScanner')) {
          console.log('MobileApp: Checking using MLKitBarcodeScanner');
          const status = await BarcodeScanner.checkPermissions();
          console.log('MobileApp: BarcodeScanner permission status:', status);
          
          hasPermission = status.camera === 'granted';
          
          if (!hasPermission) {
            // Request permission directly
            await Toast.show({
              text: 'App requires camera permission to scan barcodes',
              duration: 'long'
            });
            
            console.log('MobileApp: Requesting BarcodeScanner permission');
            const result = await BarcodeScanner.requestPermissions();
            console.log('MobileApp: BarcodeScanner permission request result:', result);
            
            hasPermission = result.camera === 'granted';
            
            // If permission is denied, try to open settings
            if (!hasPermission && result.camera === 'denied') {
              await Toast.show({
                text: 'Camera permission denied. Will try to open app settings',
                duration: 'long'
              });
              
              const appId = 'app.lovable.foodvault.manager';
              if (Capacitor.getPlatform() === 'android') {
                // Try to open Android settings using Browser.open
                try {
                  await Browser.open({ url: `package:${appId}` });
                } catch (e) {
                  console.error('MobileApp: Error opening app settings:', e);
                  await Toast.show({
                    text: 'Please manually open app settings and enable camera permission',
                    duration: 'long'
                  });
                }
              }
            }
          }
        }
        
        // Update permission request state
        setPermissionRequested(true);
        
      } catch (error) {
        console.error('MobileApp: Error requesting camera permission:', error);
        
        // Show error message to the user
        try {
          await Toast.show({
            text: 'Error requesting camera permission',
            duration: 'long'
          });
        } catch (e) {
          console.error('MobileApp: Error showing Toast message:', e);
        }
      }
    };
    
    // Execute permission request after a short delay to ensure components are initialized
    const timer = setTimeout(() => {
      if (!permissionRequested) {
        requestCameraPermission();
      }
    }, 1000);
    
    // Clean up timer when component is unmounted
    return () => clearTimeout(timer);
  }, [permissionRequested]);
  
  // Register app state change listener
  useEffect(() => {
    console.log('MobileApp: Registering app state change listener');
    
    // Use a temporary variable to store the listener result
    let appStateChangeListener: any = null;
    
    // Add the listener and store it in the temporary variable
    const setupListener = async () => {
      try {
        appStateChangeListener = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            console.log('MobileApp: App is active, checking camera permissions');
            // Check permissions when app becomes active
            scannerPermissionService.checkPermission()
              .then(hasPermission => {
                console.log('MobileApp: Camera permission status when resuming:', hasPermission);
              })
              .catch(error => {
                console.error('MobileApp: Error checking camera permission when resuming:', error);
              });
          }
        });
      } catch (error) {
        console.error('MobileApp: Error setting up app state listener:', error);
      }
    };
    
    // Execute setup
    setupListener();
    
    // Clean up listener when component is unmounted
    return () => {
      if (appStateChangeListener) {
        appStateChangeListener.remove();
      }
    };
  }, []);
  
  // Check authentication state
  const isRestaurantLoggedIn = localStorage.getItem('isRestaurantLogin') === 'true';
  
  // If there's a network error, show network error view
  if (networkError.show) {
    return (
      <NetworkErrorView 
        onRetry={handleRetryConnection}
        errorCode={networkError.errorCode}
        additionalInfo={networkError.additionalInfo}
        url={networkError.url}
      />
    );
  }
  
  // Render authentication routes or main app routes based on login state
  return isRestaurantLoggedIn ? <AppRoutes /> : <AuthRoutes />;
};

export default MobileApp;
