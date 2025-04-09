
export interface Barcode {
  id: string;
  product_id: string;
  qr_code: string;
  is_used: boolean;
}

export interface Product {
  id: string;
  name: string;
  imageUrl?: string;
}
