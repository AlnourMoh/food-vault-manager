
/**
 * Platform and device capability detection service
 */
import { Capacitor } from '@capacitor/core';

class PlatformService {
  /**
   * Is the app running in a native environment (not web)
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * Get current platform (ios, android, web)
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }
  
  /**
   * Check if a specific plugin is available
   */
  public isPluginAvailable(pluginName: string): boolean {
    return Capacitor.isPluginAvailable(pluginName);
  }
  
  /**
   * Check if running in a WebView
   */
  public isWebView(): boolean {
    return navigator.userAgent.toLowerCase().includes('wv');
  }
  
  /**
   * Check if device is a mobile device
   */
  public isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }
  
  /**
   * Check if the app is installed (as opposed to running in a browser)
   * This checks if the app is running in standalone mode
   */
  public isInstalledApp(): boolean {
    // Check for iOS standalone mode
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    // Check for display-mode: standalone (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    return isIOSStandalone || isStandalone;
  }
  
  /**
   * Get detailed platform information
   */
  public getPlatformInfo(): { 
    platform: string;
    isNative: boolean;
    isWebView: boolean;
    isMobile: boolean;
    isInstalledApp: boolean;
    userAgent: string;
  } {
    return {
      platform: this.getPlatform(),
      isNative: this.isNativePlatform(),
      isWebView: this.isWebView(),
      isMobile: this.isMobileDevice(),
      isInstalledApp: this.isInstalledApp(),
      userAgent: navigator.userAgent
    };
  }
}

export const platformService = new PlatformService();
