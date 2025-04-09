
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
