
import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { toast } from '@/hooks/use-toast';

export const useBackButtonHandler = () => {
  const [lastBackPress, setLastBackPress] = useState<number>(0);
  const DOUBLE_PRESS_DELAY = 300; // 300ms window for double press

  useEffect(() => {
    const setupBackButtonHandler = async () => {
      try {
        if (window.Capacitor) {
          console.log('Setting up back button handler');
          
          await App.addListener('backButton', ({ canGoBack }) => {
            console.log('Back button pressed, canGoBack:', canGoBack);
            
            try {
              const currentTime = Date.now();
              
              if (canGoBack) {
                window.history.back();
              } else {
                // Check if this is a double press
                if (currentTime - lastBackPress <= DOUBLE_PRESS_DELAY) {
                  // Double press detected - minimize app
                  App.minimizeApp();
                } else {
                  // First press - update timestamp
                  setLastBackPress(currentTime);
                  
                  // Show notification indicating a second press will minimize
                  toast({
                    title: "اضغط مرة أخرى للخروج",
                    duration: 2000,
                  });
                }
              }
            } catch (backButtonError) {
              console.error("Error handling back button:", backButtonError);
              // Try to navigate back as fallback
              try {
                window.history.back();
              } catch (navigateError) {
                console.error("Error navigating back:", navigateError);
              }
            }
          });
        }
      } catch (setupError) {
        console.error("Error setting up back button handler:", setupError);
      }
    };
    
    setupBackButtonHandler();
    
    return () => {
      try {
        if (window.Capacitor) {
          App.removeAllListeners();
        }
      } catch (cleanupError) {
        console.error("Error during Capacitor listeners cleanup:", cleanupError);
      }
    };
  }, [lastBackPress]);
};
