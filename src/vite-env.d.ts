

/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

// Capacitor global object
interface Window {
  Capacitor?: {
    isNative?: boolean;
    isPluginAvailable: (pluginName: string) => boolean;
    getPlatform: () => string;
  };
}

// Add standalone property to Navigator interface
interface Navigator {
  standalone?: boolean;
}

