
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Request camera permissions when component mounts
    const checkPermissions = async () => {
      try {
        // Check if we're in a Capacitor environment with the plugin available
        if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
          const { camera } = await import('@capacitor/camera');
          const permission = await camera.requestPermissions();
          
          if (permission.camera === 'granted') {
            setHasPermission(true);
          } else {
            setHasPermission(false);
            toast({
              title: "لا يوجد إذن للكاميرا",
              description: "يرجى السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي",
              variant: "destructive"
            });
          }
        } else {
          console.log('Running in web environment or plugin not available');
          // In development, just simulate permission granted
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء طلب إذن الكاميرا",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermissions();
  }, [toast]);
  
  const startScan = async () => {
    if (!hasPermission) return;
    
    try {
      setIsScanningActive(true);
      
      // Check if we're in a Capacitor environment
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        
        // Make background transparent to show camera preview
        document.body.classList.add('barcode-scanner-active');
        
        // Start the scan
        const result = await BarcodeScanner.startScan();
        
        if (result.hasContent) {
          const scannedCode = result.content;
          handleSuccessfulScan(scannedCode);
        }
      } else {
        // For development/web: simulate scanning with a timeout
        setTimeout(() => {
          const mockBarcode = `TEST-${Math.floor(Math.random() * 1000000)}`;
          handleSuccessfulScan(mockBarcode);
        }, 2000);
      }
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "خطأ في المسح",
        description: "حدث خطأ أثناء محاولة مسح الباركود",
        variant: "destructive"
      });
      stopScan();
    }
  };
  
  const stopScan = async () => {
    setIsScanningActive(false);
    
    if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
      const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
      await BarcodeScanner.stopScan();
      document.body.classList.remove('barcode-scanner-active');
    }
  };
  
  const handleSuccessfulScan = async (code: string) => {
    setLastScannedCode(code);
    stopScan();
    
    // Display success message
    toast({
      title: "تم المسح بنجاح",
      description: `تم مسح الباركود: ${code}`,
    });
    
    try {
      // Check if the scanned code exists in the database
      const { data: productCode, error } = await supabase
        .from('product_codes')
        .select('product_id, is_used')
        .eq('qr_code', code)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "باركود غير معروف",
            description: "هذا الباركود غير مسجل في النظام",
            variant: "destructive"
          });
        } else {
          console.error('Database query error:', error);
          toast({
            title: "خطأ في قاعدة البيانات",
            description: "حدث خطأ أثناء التحقق من الباركود",
            variant: "destructive"
          });
        }
        return;
      }
      
      if (productCode.is_used) {
        toast({
          title: "باركود مستخدم",
          description: "تم استخدام هذا الباركود من قبل",
          variant: "destructive"
        });
      } else {
        // Trigger the onScan callback with the scanned code
        onScan(code);
      }
    } catch (error) {
      console.error('Error processing scanned code:', error);
    }
  };
  
  // Handle component unmount
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);
  
  if (isLoading) {
    return (
      <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
        <div className="flex flex-col items-center justify-center h-60">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </div>
      </Card>
    );
  }
  
  if (hasPermission === false) {
    return (
      <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
        <div className="flex flex-col items-center justify-center h-60">
          <Camera className="text-destructive h-16 w-16 mb-4" />
          <h3 className="text-xl font-bold mb-2">لا يوجد إذن للكاميرا</h3>
          <p className="text-center text-muted-foreground mb-4">
            يرجى السماح بالوصول إلى الكاميرا في إعدادات جهازك لاستخدام الماسح الضوئي
          </p>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div className={`fixed inset-0 z-50 ${isScanningActive ? 'scanning-active' : ''}`}>
      {isScanningActive ? (
        // Scanning view
        <div className="absolute inset-0 flex flex-col items-center">
          <div className="flex-1 w-full relative">
            {/* Transparent scanner window with frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-primary rounded-lg scanner-target-frame"></div>
            </div>
            
            {/* Scanner controls at bottom */}
            <div className="absolute bottom-8 inset-x-0 flex justify-center">
              <Button 
                variant="destructive" 
                size="lg" 
                className="rounded-full h-16 w-16 flex items-center justify-center"
                onClick={stopScan}
              >
                <X className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Scanner ready view
        <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
          <div className="flex flex-col items-center justify-center h-60">
            {lastScannedCode ? (
              <>
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Check className="text-primary h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">تم المسح بنجاح</h3>
                <p className="text-center text-muted-foreground mb-4 direction-ltr">
                  {lastScannedCode}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>إغلاق</Button>
                  <Button variant="default" onClick={startScan}>مسح آخر</Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 p-3 bg-primary/10 rounded-full">
                  <Camera className="text-primary h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">ماسح الباركود</h3>
                <p className="text-center text-muted-foreground mb-4">
                  قم بتوجيه الكاميرا إلى باركود المنتج لمسحه
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>إلغاء</Button>
                  <Button variant="default" onClick={startScan}>بدء المسح</Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BarcodeScanner;
