
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useScannerEnvironment } from '@/hooks/useScannerEnvironment';

/**
 * مكون لاختبار قدرات Capacitor والبيئة
 */
const CapacitorTester: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const environment = useScannerEnvironment();

  return (
    <div className="border border-slate-200 rounded-md p-3 text-xs bg-slate-50 text-slate-700">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Capacitor Environment Tester</h3>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-500 underline"
        >
          {expanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span>Capacitor Version:</span>
            <span>{Capacitor.getPlatform()}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Is Native Platform:</span>
            <span className={environment.isNativePlatform ? "text-green-600" : "text-red-600"}>
              {String(environment.isNativePlatform)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Is WebView:</span>
            <span className={environment.isWebView ? "text-green-600" : "text-red-600"}>
              {String(environment.isWebView)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Is Effectively Native:</span>
            <span className={environment.isEffectivelyNative ? "text-green-600" : "text-red-600"}>
              {String(environment.isEffectivelyNative)}
            </span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-200">
            <h4 className="font-bold mb-1">Available Plugins:</h4>
            <ul className="space-y-1">
              {Object.entries(environment.availablePlugins).map(([plugin, available]) => (
                <li key={plugin} className="flex justify-between">
                  <span>{plugin}:</span>
                  <span className={available ? "text-green-600" : "text-red-600"}>
                    {String(available)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-2 pt-2 border-t border-slate-200 break-words text-[10px]">
            <h4 className="font-bold mb-1">User Agent:</h4>
            <p>{navigator.userAgent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapacitorTester;
