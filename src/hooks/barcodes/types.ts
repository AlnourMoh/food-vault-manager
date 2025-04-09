
/**
 * Type definitions for barcode-related functionality
 * These types are shared across all barcode-related components and hooks
 */

export interface Barcode {
  /**
   * Unique identifier for the barcode
   */
  id: string;
  
  /**
   * Foreign key linking to the product this barcode belongs to
   */
  product_id: string;
  
  /**
   * The actual barcode string that will be encoded visually
   */
  qr_code: string;
  
  /**
   * Indicates whether this barcode has been used/scanned
   */
  is_used: boolean;
}

export interface Product {
  /**
   * Unique identifier for the product
   */
  id: string;
  
  /**
   * Display name of the product
   */
  name: string;
  
  /**
   * Optional URL to the product image
   */
  imageUrl?: string;
}

/**
 * Defines the available barcode label sizes with their dimensions
 */
export interface LabelSize {
  /**
   * Unique identifier for the label size
   */
  id: string;
  
  /**
   * Human-readable name of the label size
   */
  name: string;
  
  /**
   * Width of the label in millimeters
   */
  width: number;
  
  /**
   * Height of the label in millimeters
   */
  height: number;
}

/**
 * Available label sizes for barcode printing
 */
export const LABEL_SIZES: LabelSize[] = [
  { id: 'small', name: 'صغير (40mm × 25mm)', width: 40, height: 25 },
  { id: 'medium', name: 'متوسط (50mm × 30mm)', width: 50, height: 30 },
  { id: 'large', name: 'كبير (70mm × 50mm)', width: 70, height: 50 },
];

