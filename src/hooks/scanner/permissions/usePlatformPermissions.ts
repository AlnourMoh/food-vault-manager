
import { App } from '@capacitor/app';

export const usePlatformPermissions = () => {
  const handleIosPermissions = async () => {
    const confirm = window.confirm("هل تريد فتح إعدادات التطبيق لتمكين إذن الكاميرا؟");
    if (confirm) {
      await App.exitApp();
    }
    return false;
  };

  const handleAndroidPermissions = () => {
    alert("لتمكين إذن الكاميرا، يرجى الذهاب إلى:\n إعدادات > التطبيقات > مخزن الطعام > الأذونات > الكاميرا");
    return false;
  };

  const handleWebPermissions = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        return true;
      } catch {
        return false;
      }
    }
    return true; // Fallback for testing
  };

  return {
    handleIosPermissions,
    handleAndroidPermissions,
    handleWebPermissions
  };
};
