
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
    CapacitorMlkitBarcodeScanning: {
      presentationStyle: "fullscreen",
      detectorSize: 0.8,
      topTitle: "قم بتوجيه الكاميرا نحو الباركود",
      bottomTitle: "يتم المسح تلقائيًا عند اكتشاف رمز",
      cancelText: "إلغاء",
      cornerColor: "#2E7D32",
      cornerRadius: 8,
      cornerWidth: 4,
      formats: ["QrCode", "Ean13", "Ean8", "Code39", "Code128", 
                "UpcA", "UpcE", "Pdf417", "Aztec", "DataMatrix",
                "Itf", "Codabar"]
    },
    Permissions: {
      camera: {
        message: "تطبيق مخزن الطعام يحتاج إلى إذن الكاميرا لمسح الباركود"
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
        usageDescription: "تطبيق مخزن الطعام يحتاج إلى الوصول إلى الكاميرا لمسح الباركود وقراءة رموز المنتجات"
      }
    ]
  }
};

export default config;
