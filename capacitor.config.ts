
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.foodvault.manager',
  appName: 'Food Vault',
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
      promptLabelHeader: "Camera Access",
      promptLabelText: "The app needs camera permission to scan barcodes",
      promptLabelCancel: "Cancel",
      promptLabelConfirm: "Allow"
    },
    CapacitorHttp: {
      enabled: true
    },
    // تحسين إعدادات الماسح الضوئي
    MLKitBarcodeScanner: {
      formats: [1, 32, 64, 16, 512, 1024], // QR_CODE, EAN_13, CODE_128, CODE_39, UPC_A, UPC_E
      detectionSpeed: "fast",
      cameraPermissionText: "The app needs camera permission to scan barcodes",
      lensFacing: "back", // توجيه الكاميرا الخلفية افتراضياً
      detectorSize: 0.7 // تحديد حجم منطقة الكشف
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
        usageDescription: "Food Vault app needs access to the camera to scan barcodes and read product codes"
      }
    ]
  }
};

export default config;
