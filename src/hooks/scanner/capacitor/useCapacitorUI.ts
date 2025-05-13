
import { useState, useCallback } from 'react';

/**
 * هوك لإدارة واجهة المستخدم للماسح
 */
export const useCapacitorUI = () => {
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);

  /**
   * إعداد واجهة المستخدم للماسح
   */
  const setupScannerUI = useCallback((): void => {
    document.body.classList.add('scanner-active');
  }, []);

  /**
   * استعادة واجهة المستخدم بعد المسح
   */
  const restoreUI = useCallback((): void => {
    document.body.classList.remove('scanner-active');
  }, []);

  /**
   * تفعيل وضع الإدخال اليدوي
   */
  const activateManualEntry = useCallback((): void => {
    setIsManualEntry(true);
  }, []);

  /**
   * إلغاء وضع الإدخال اليدوي
   */
  const cancelManualEntry = useCallback((): void => {
    setIsManualEntry(false);
  }, []);

  return {
    isManualEntry,
    setupScannerUI,
    restoreUI,
    activateManualEntry,
    cancelManualEntry
  };
};
