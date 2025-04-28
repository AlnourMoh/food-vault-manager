
import React from 'react';
import styles from '../scanner.module.css';

interface ScannerFrameProps {
  children?: React.ReactNode;
}

export const ScannerFrame = ({ children }: ScannerFrameProps) => {
  return (
    <div className={styles.targetFrame}>
      <div className={styles.scanLine} />
      <div className={styles.guideText}>
        <p className="mb-2 font-bold text-white">قم بتوجيه الكاميرا نحو الباركود</p>
        <p className="text-sm opacity-80 text-white">يتم المسح تلقائيًا عند اكتشاف رمز</p>
      </div>
      {children}
    </div>
  );
};
