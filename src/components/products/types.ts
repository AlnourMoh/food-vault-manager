
export interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  expiryDate: string;
  productionDate?: string; // Add optional productionDate field
  image: File | null;
  imageUrl: string;
}

export interface Unit {
  value: string;
  label: string;
}

export interface FormError {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: string;
  expiryDate?: string;
  image?: string;
}
