
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.foodvault.manager',
  appName: 'مخزن الطعام',
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
      promptLabelText: "يحتاج التطبيق إلى إذن الكاميرا لمسح الباركود",
      promptLabelCancel: "إلغاء",
      promptLabelConfirm: "السماح"
    },
    BarcodeScanner: {
      promptLabelHeader: "الوصول إلى الكاميرا",
      promptLabelText: "يحتاج التطبيق إلى إذن الكاميرا لمسح الباركود",
      promptLabelCancel: "إلغاء",
      promptLabelConfirm: "السماح",
      detectionSpeed: "normal",
      targetedFormats: ["QR_CODE", "EAN_13", "EAN_8", "CODE_39", "CODE_128", 
                        "UPC_A", "UPC_E", "PDF_417", "AZTEC", "DATA_MATRIX",
                        "ITF", "CODABAR"]
    },
    Permissions: {
      camera: {
        message: "يحتاج التطبيق إلى إذن الكاميرا لمسح الباركود"
      }
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    flavor: "appflavor",
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      signingType: null,
      skipJarsigning: null
    },
    appendUserAgent: "FoodVaultManager",
    permissions: [
      "android.permission.CAMERA"
    ]
  },
  ios: {
    path: "ios",
    scheme: "foodvaultmanager",
    cordovaLinkerFlags: [],
    cordovaSwiftVersion: "5.0",
    limitsNavigationsToAppBoundDomains: true,
    contentInset: "always",
    permissions: [
      {
        name: "Camera",
        usageDescription: "يحتاج التطبيق إلى الوصول إلى الكاميرا لمسح الباركود"
      }
    ]
  }
};

export default config;
