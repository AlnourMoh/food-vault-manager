
export interface StartScanOptions {
  formats?: BarcodeFormat[];
  continuous?: boolean; // Add this line to define the continuous property
  onScanComplete?: (result: ScanResult) => void;
}
