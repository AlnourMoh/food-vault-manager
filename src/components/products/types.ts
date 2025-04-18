
export interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  expiryDate: string;
  productionDate?: string; 
  image: File | null;
  imageUrl: string;
}

export type Unit = { value: string; label: string };

export interface FormError {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: string;
  expiryDate?: string;
  productionDate?: string;
  image?: string;
}
