
import React from 'react';
import styles from '../scanner.module.css';

export interface ScannerFrameProps {
  isActive: boolean;
  hasError: boolean;
  children?: React.ReactNode;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({ isActive, hasError, children }) => {
  return (
    <div className={`${styles.targetFrame} ${hasError ? styles.frameError : ''}`}>
      <div className={`${styles.scanLine} ${isActive && !hasError ? styles.scanning : ''}`} />
      {children}
      <div className={styles.guideText}>
        <p className="mb-2 font-bold text-white">قم بتوجيه الكاميرا نحو الباركود</p>
        <p className="text-sm opacity-80 text-white">يتم المسح تلقائيًا عند اكتشاف رمز</p>
      </div>
    </div>
  );
};
