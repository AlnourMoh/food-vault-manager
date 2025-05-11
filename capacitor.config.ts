
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.foodvault.manager',
  appName: 'FoodVault Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // استخدام التطبيق بدون الاعتماد على خادم خارجي
    url: 'https://b3b6b969-583d-416c-9d8b-788fa375abca.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // السماح بتشغيل التطبيق في وضع عدم الاتصال مع المحتوى المخزن مؤقتًا
    allowNavigation: ['*'],
    errorPath: 'error.html'
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
    CapacitorHttp: {
      enabled: true
    },
    // تحديث إعدادات الماسح الضوئي
    MLKitBarcodeScanner: {
      formats: ["QR_CODE", "EAN_13", "CODE_128", "CODE_39", "UPC_A", "UPC_E"],
      detectionSpeed: "fast",
      cameraPermissionText: "التطبيق يحتاج إلى إذن الكاميرا لمسح الباركود"
    }
  },
  android: {
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
      "android.permission.CAMERA",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET",
      "android.permission.FLASHLIGHT",
      "android.permission.VIBRATE"
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
        usageDescription: "تطبيق مخزن الطعام يحتاج إلى الوصول إلى الكاميرا لمسح الباركود وقراءة رموز المنتجات"
      }
    ]
  }
};

export default config;
