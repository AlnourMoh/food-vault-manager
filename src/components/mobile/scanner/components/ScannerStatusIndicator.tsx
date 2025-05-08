
import React from 'react';
import styles from '../scanner.module.css';

interface ScannerStatusIndicatorProps {
  isActive: boolean;
  hasError: boolean;
}

export const ScannerStatusIndicator: React.FC<ScannerStatusIndicatorProps> = ({ isActive, hasError }) => {
  return (
    <div className={styles.statusIndicator}>
      {isActive ? 
        (hasError ? 'خطأ في الماسح' : 'الماسح نشط') : 
        'الماسح غير نشط'
      }
    </div>
  );
};
