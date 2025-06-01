
import { Capacitor } from '@capacitor/core';

class PlatformService {
  /**
   * Check if running on native platform
   */
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Check if running in web view
   */
  public isWebView(): boolean {
    // Check for common webview indicators
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || 
           userAgent.includes('webview') || 
           document.referrer.includes('android-app://');
  }

  /**
   * Check if running as installed app
   */
  public isInstalledApp(): boolean {
    // Check for PWA indicators
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  /**
   * Get current platform
   */
  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  /**
   * Check if plugin is available
   */
  public isPluginAvailable(plugin: string): boolean {
    return Capacitor.isPluginAvailable(plugin);
  }
}

export const platformService = new PlatformService();
