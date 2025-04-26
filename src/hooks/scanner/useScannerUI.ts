
export const useScannerUI = () => {
  const setupScannerBackground = () => {
    document.body.classList.add('scanner-transparent-background');
    document.body.style.background = 'transparent';
  };

  const cleanupScannerBackground = () => {
    document.body.classList.remove('scanner-transparent-background');
    document.body.style.background = '';
  };

  return {
    setupScannerBackground,
    cleanupScannerBackground
  };
};
