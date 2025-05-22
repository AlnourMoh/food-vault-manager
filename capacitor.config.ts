
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.foodvault.manager',
  appName: 'Food Vault',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Use the app without relying on an external server
    url: 'https://b3b6b969-583d-416c-9d8b-788fa375abca.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // Allow the app to run offline with cached content
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
      promptLabelHeader: "Camera Access Required",
      promptLabelText: "Food Vault needs camera permission to scan barcodes",
      promptLabelCancel: "Cancel",
      promptLabelConfirm: "Allow"
    },
    CapacitorHttp: {
      enabled: true
    },
    // Improved scanner settings
    MLKitBarcodeScanner: {
      formats: [1, 32, 64, 16, 512, 1024], // QR_CODE, EAN_13, CODE_128, CODE_39, UPC_A, UPC_E
      detectionSpeed: "fast",
      cameraPermissionText: "Food Vault needs camera permission to scan barcodes",
      lensFacing: "back", // Use back camera by default
      detectorSize: 0.7 // Set detection area size
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
