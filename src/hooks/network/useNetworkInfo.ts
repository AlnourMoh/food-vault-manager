
import { useState, useEffect } from 'react';

interface NetworkInfoResult {
  connectionType: string | null;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  online: boolean;
  lastUpdate: Date;
}

export const useNetworkInfo = (): NetworkInfoResult => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoResult>({
    connectionType: null,
    effectiveType: null,
    downlink: null,
    rtt: null,
    online: navigator.onLine,
    lastUpdate: new Date()
  });

  useEffect(() => {
    // Function to update network information
    const updateNetworkInfo = () => {
      let connectionInfo: Partial<NetworkInfoResult> = {
        online: navigator.onLine,
        lastUpdate: new Date()
      };
      
      // Getting connection type if available
      if ('connection' in navigator && navigator.connection) {
        const conn = navigator.connection as any;
        connectionInfo = {
          ...connectionInfo,
          connectionType: conn.type || null,
          effectiveType: conn.effectiveType || null,
          downlink: typeof conn.downlink === 'number' ? conn.downlink : null,
          rtt: typeof conn.rtt === 'number' ? conn.rtt : null
        };
      }
      
      setNetworkInfo((prev) => ({
        ...prev,
        ...connectionInfo
      }));
    };
    
    // Setup event listeners for network changes
    const setupListeners = () => {
      window.addEventListener('online', updateNetworkInfo);
      window.addEventListener('offline', updateNetworkInfo);
      
      if ('connection' in navigator && navigator.connection) {
        (navigator.connection as any).addEventListener('change', updateNetworkInfo);
      }
    };
    
    // Initial update
    updateNetworkInfo();
    setupListeners();
    
    // Update network info periodically (every 30 seconds)
    const intervalId = setInterval(updateNetworkInfo, 30000);
    
    // Clean up
    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      
      if ('connection' in navigator && navigator.connection) {
        (navigator.connection as any).removeEventListener('change', updateNetworkInfo);
      }
      
      clearInterval(intervalId);
    };
  }, []);

  return networkInfo;
};
