
import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { toast } from '@/hooks/use-toast';
import { useNetworkStatus } from '@/hooks/network/useNetworkStatus';
import { useServerConnection } from '@/hooks/network/useServerConnection';

export const useNetworkConnectionHandler = () => {
  const { isOnline } = useNetworkStatus();
  const { 
    isConnectedToServer, 
    errorInfo, 
    checkServerConnection, 
    forceReconnect,
    isChecking 
  } = useServerConnection();
  
  const [networkError, setNetworkError] = useState<{
    show: boolean;
    errorCode?: string;
    additionalInfo?: string;
    url?: string;
  }>({
    show: false
  });
  
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [lastNetworkEvent, setLastNetworkEvent] = useState<Date | null>(null);

  // Function to check connection status comprehensively
  const checkConnection = async () => {
    try {
      console.log('Checking connection...');
      
      if (window.Capacitor) {
        try {
          const networkStatus = await Network.getStatus();
          console.log('Network status from Capacitor:', networkStatus);
          
          if (!networkStatus.connected) {
            setNetworkError({
              show: true,
              errorCode: "net::ERR_INTERNET_DISCONNECTED",
              additionalInfo: "لا يوجد اتصال بالإنترنت - تم اكتشافه بواسطة Capacitor Network"
            });
            return;
          }
        } catch (networkError) {
          console.error("Error checking network via Capacitor:", networkError);
        }
      }
      
      // If online according to any method, check server connection
      if (navigator.onLine) {
        try {
          await checkServerConnection();
        } catch (serverError) {
          console.error("Error checking server connection:", serverError);
          setNetworkError({
            show: true,
            errorCode: "net::ERR_SERVER_UNREACHABLE",
            additionalInfo: "تعذر الاتصال بالخادم"
          });
        }
      } else {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED", 
          additionalInfo: "جهازك غير متصل بالإنترنت"
        });
      }
    } catch (error) {
      console.error("Error in checkConnection:", error);
      setNetworkError({
        show: true,
        errorCode: "net::ERR_CONNECTION_CHECK_FAILED",
        additionalInfo: `خطأ أثناء التحقق من الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      });
    }
  };

  // Set up network listeners
  useEffect(() => {
    const setupNetworkListeners = async () => {
      try {
        console.log("Setting up network listeners");
        
        if (window.Capacitor) {
          try {
            await Network.addListener('networkStatusChange', status => {
              console.log('Network status changed:', status);
              setLastNetworkEvent(new Date());
              
              if (status.connected) {
                toast({
                  title: "تم استعادة الاتصال",
                  description: "جاري التحقق من الاتصال بالخادم...",
                });
                
                // Small delay to let network stabilize
                setTimeout(() => {
                  checkConnection();
                }, 1500);
              } else {
                setNetworkError({
                  show: true,
                  errorCode: "net::ERR_INTERNET_DISCONNECTED",
                  additionalInfo: "انقطع الاتصال بالإنترنت"
                });
                
                toast({
                  variant: "destructive",
                  title: "انقطع الاتصال",
                  description: "لا يوجد اتصال بالإنترنت",
                });
              }
            });
            
            // Initial check
            const initialStatus = await Network.getStatus();
            console.log('Initial network status:', initialStatus);
            
            if (!initialStatus.connected) {
              setNetworkError({
                show: true,
                errorCode: "net::ERR_INTERNET_DISCONNECTED",
                additionalInfo: "جهازك غير متصل بالإنترنت"
              });
            } else {
              checkServerConnection().catch(err => {
                console.error("Initial server connection check failed:", err);
              });
            }
          } catch (capacitorError) {
            console.error("Error with Capacitor network setup:", capacitorError);
            setupBrowserFallback();
          }
        } else {
          setupBrowserFallback();
        }
      } catch (setupError) {
        console.error("Critical error in network setup:", setupError);
        setupBrowserFallback();
      }
    };
    
    // Use browser APIs as fallback
    const setupBrowserFallback = () => {
      window.addEventListener('online', () => {
        toast({
          title: "تم استعادة الاتصال",
          description: "جاري التحقق من الاتصال بالخادم...",
        });
        
        setLastNetworkEvent(new Date());
        checkConnection();
      });
      
      window.addEventListener('offline', () => {
        setLastNetworkEvent(new Date());
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED",
          additionalInfo: "انقطع الاتصال بالإنترنت"
        });
        
        toast({
          variant: "destructive",
          title: "انقطع الاتصال",
          description: "لا يوجد اتصال بالإنترنت",
        });
      });
      
      // Initial check using browser API
      if (!navigator.onLine) {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_INTERNET_DISCONNECTED",
          additionalInfo: "جهازك غير متصل بالإنترنت"
        });
      } else {
        checkServerConnection().catch(err => {
          console.error("Initial server connection check failed:", err);
        });
      }
    };
    
    setupNetworkListeners();
    
    return () => {
      // Cleanup listeners
      try {
        if (window.Capacitor) {
          Network.removeAllListeners();
        } else {
          window.removeEventListener('online', () => {});
          window.removeEventListener('offline', () => {});
        }
      } catch (cleanupError) {
        console.error("Error during network listeners cleanup:", cleanupError);
      }
    };
  }, []);

  // Update network error state based on server connection
  useEffect(() => {
    try {
      if (!isConnectedToServer && isOnline && !isChecking) {
        setNetworkError({
          show: true,
          errorCode: "net::ERR_HTTP_RESPONSE_CODE_FAILURE",
          additionalInfo: errorInfo,
          url: window.location.href
        });
      } else if (isConnectedToServer) {
        setNetworkError({ show: false });
      }
    } catch (stateUpdateError) {
      console.error("Error updating network error state:", stateUpdateError);
    }
  }, [isConnectedToServer, errorInfo, isOnline, isChecking]);

  // Function to retry connection
  const handleRetryConnection = async () => {
    setRetryAttempt(prev => prev + 1);
    
    toast({
      title: "جاري التحقق من الاتصال",
      description: "يرجى الانتظار...",
    });
    
    try {
      const success = await forceReconnect();
      
      if (success) {
        setNetworkError({ show: false });
        toast({
          title: "تم استعادة الاتصال",
          description: "تم الاتصال بالخادم بنجاح",
        });
      } else {
        toast({
          variant: "destructive",
          title: "فشل الاتصال",
          description: "فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى",
        });
      }
    } catch (error) {
      console.error("Error during retry:", error);
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "حدث خطأ أثناء محاولة الاتصال بالخادم",
      });
    }
  };

  return {
    networkError,
    handleRetryConnection
  };
};
