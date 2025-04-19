
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b3b6b969583d416c9d8b788fa375abca',
  appName: 'food-vault-manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://b3b6b969-583d-416c-9d8b-788fa375abca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#2E7D32",
    },
    Camera: {
      promptLabelHeader: "الوصول إلى الكاميرا",
      promptLabelText: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
      promptLabelCancel: "إلغاء",
      promptLabelConfirm: "السماح"
    },
    BarcodeScanner: {
      promptLabelHeader: "الوصول إلى الكاميرا",
      promptLabelText: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود",
      promptLabelCancel: "إلغاء",
      promptLabelConfirm: "السماح",
      detectionSpeed: "normal", // normal or fast (fast may drain battery quicker)
      targetedFormats: ["QR_CODE", "EAN_13", "EAN_8", "CODE_39", "CODE_128", 
                        "UPC_A", "UPC_E", "PDF_417", "AZTEC", "DATA_MATRIX",
                        "ITF", "CODABAR"]
    },
    Permissions: {
      camera: {
        message: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود"
      }
    }
  }
};

export default config;
