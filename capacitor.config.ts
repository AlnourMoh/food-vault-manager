
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.foodvault.manager',
  appName: 'مخزن الطعام',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // استخدام التطبيق بدون الاعتماد على خادم خارجي
    url: 'https://b3b6b969-583d-416c-9d8b-788fa375abca.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // Allow app to run in offline mode with cached content
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
    // إعدادات ماسح الباركود MLKit مع تحسينات إضافية
    MLKitBarcodeScanning: {
      keys: {},
      formats: ["QR_CODE", "UPC_E", "UPC_A", "EAN_8", "EAN_13", "CODE_39", "CODE_93", "CODE_128", "ITF", "CODABAR"],
      scanMode: "CONTINUOUS",
      detectorSize: 0.7, // زيادة حجم كاشف الباركود
      cameraFacing: "back",
      flashButtonVisible: true,
      timeout: 10000, // وقت انتظار أطول (10 ثواني)
    },
    Toast: {
      style: "center",
      duration: "short", // الإعداد الافتراضي
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
      "android.permission.CAMERA",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET",
      "android.permission.FLASHLIGHT", // إذن للفلاش
      "android.permission.VIBRATE" // إذن للاهتزاز عند المسح
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
