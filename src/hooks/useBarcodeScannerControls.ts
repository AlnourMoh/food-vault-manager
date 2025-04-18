
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseBarcodeScannerControls {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const useBarcodeScannerControls = ({ onScan, onClose }: UseBarcodeScannerControls) => {
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const startScan = async () => {
    try {
      setIsScanningActive(true);
      
      if (window.Capacitor && window.Capacitor.isPluginAvailable('BarcodeScanner')) {
        const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');
        document.body.classList.add('barcode-scanner-active');
        
        const result = await BarcodeScanner.startScan();
        
        if (result.hasContent) {
          handleSuccessfulScan(result.content);
        }
      } else {
        // For development/web: simulate scanning
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
    
    toast({
      title: "تم المسح بنجاح",
      description: `تم مسح الباركود: ${code}`,
    });
    
    try {
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
        onScan(code);
      }
    } catch (error) {
      console.error('Error processing scanned code:', error);
    }
  };
  
  return {
    isScanningActive,
    lastScannedCode,
    startScan,
    stopScan
  };
};
