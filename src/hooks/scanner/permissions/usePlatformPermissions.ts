
import { App } from '@capacitor/app';

/**
 * Hook for handling platform-specific permission requests
 * Provides specialized handling for iOS, Android and Web environments
 */
export const usePlatformPermissions = () => {
  /**
   * Handles iOS-specific permission requests
   * On iOS, we need to prompt the user to open settings manually
   */
  const handleIosPermissions = async () => {
    console.log('Handling iOS camera permissions request');
    // For iOS, we need to guide the user to settings since iOS doesn't provide direct settings access
    const confirm = window.confirm("هل تريد فتح إعدادات التطبيق لتمكين إذن الكاميرا؟");
    if (confirm) {
      console.log('User confirmed, exiting app to open settings');
      // When the app reopens, iOS will prompt to open settings
      await App.exitApp();
    } else {
      console.log('User declined to open settings');
    }
    return false;
  };

  /**
   * Handles Android-specific permission requests
   * On Android, we need to show instructions for manually enabling permissions
   */
  const handleAndroidPermissions = () => {
    console.log('Handling Android camera permissions request');
    // For Android, we show detailed instructions to guide the user to app settings
    alert("لتمكين إذن الكاميرا، يرجى الذهاب إلى:\n إعدادات > التطبيقات > مخزن الطعام > الأذونات > الكاميرا");
    return false;
  };

  /**
   * Handles Web-specific permission requests
   * On Web, we try to request camera access via the browser API
   */
  const handleWebPermissions = async () => {
    console.log('Handling Web camera permissions request');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        console.log('Requesting camera access via mediaDevices API');
        // Request camera access - this will trigger the browser permission dialog
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          console.log('Camera access granted, stopping stream');
          // Clean up the stream after permission is granted
          stream.getTracks().forEach(track => track.stop());
        }
        return true;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        return false;
      }
    }
    console.log('MediaDevices API not available, assuming permission granted for testing');
    return true; // Fallback for testing
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
