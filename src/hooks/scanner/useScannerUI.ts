
import styles from '@/components/mobile/scanner/scanner.module.css';

export const useScannerUI = () => {
  const setupScannerBackground = () => {
    document.body.classList.add(styles.scannerActive);
    document.body.classList.add(styles.transparentBackground);
  };

  const cleanupScannerBackground = () => {
    document.body.classList.remove(styles.scannerActive);
    document.body.classList.remove(styles.transparentBackground);
  };

  return {
    setupScannerBackground,
    cleanupScannerBackground
  };
};
