
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PlatformService } from '@/services/scanner/PlatformService';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

/**
 * مكون مساعد للتشخيص، يعرض معلومات حول بيئة Capacitor
 */
const CapacitorTester: React.FC = () => {
  const [info, setInfo] = useState<{key: string; value: string}[]>([]);
  const environment = useScannerEnvironment();
  
  useEffect(() => {
    // محاولة اكتشاف إذا كنا في WebView
    const userAgent = navigator.userAgent;
    const isWebView = PlatformService.isInAppWebView();
    const isNative = PlatformService.isNativePlatform();
      
    // جمع معلومات التشخيص
    const diagnosticInfo = [
      { key: "Capacitor.isNativePlatform()", value: `${Capacitor.isNativePlatform()}` },
      { key: "PlatformService.isNativePlatform()", value: `${isNative}` },
      { key: "useScannerEnvironment.isNativePlatform", value: `${environment.isNativePlatform}` },
      { key: "Capacitor.platform", value: Capacitor.getPlatform() },
      { key: "PlatformService.getPlatform()", value: PlatformService.getPlatform() },
      { key: "WebView (detected)", value: `${isWebView}` },
      { key: "WebView (hook)", value: `${environment.isWebView}` },
      { key: "Window.Capacitor exists", value: `${typeof window !== 'undefined' && !!(window as any).Capacitor}` },
      { key: "Plugin: MLKitBarcodeScanner", value: `${Capacitor.isPluginAvailable('MLKitBarcodeScanner')}` },
      { key: "Plugin: Camera", value: `${Capacitor.isPluginAvailable('Camera')}` },
      { key: "Plugin: BarcodeScanner", value: `${Capacitor.isPluginAvailable('BarcodeScanner')}` },
      { key: "Plugin: App", value: `${Capacitor.isPluginAvailable('App')}` },
      { key: "User Agent", value: userAgent },
      { key: "Document: WebView", value: "WV" in navigator ? "مكتشف" : "غير مكتشف" }
    ];
    
    setInfo(diagnosticInfo);
    
    // طباعة معلومات التشخيص في وحدة التحكم
    console.log('CapacitorTester: معلومات التشخيص:', 
      diagnosticInfo.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {} as Record<string, string>)
    );
  }, [environment.isNativePlatform, environment.isWebView]);
  
  return (
    <div className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-[300px] dir-ltr">
      <h4 className="font-bold mb-2 text-gray-700">Capacitor Diagnostic:</h4>
      <table className="w-full text-left">
        <tbody>
          {info.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
              <td className="px-2 py-1 font-medium">{item.key}:</td>
              <td className="px-2 py-1 break-all">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CapacitorTester;
