
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
    const confirm = window.confirm("هل تريد فتح إعدادات التطبيق لتمكين إذن الكاميرا؟");
    if (confirm) {
      console.log('User confirmed, exiting app to open settings');
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          console.log('Camera access granted, stopping stream');
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
