
export interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  expiryDate: string;
  productionDate: string;
  image: File | null;
  imageUrl: string;
}

export interface FormError {
  name?: string;
  category?: string;
  unit?: string;
  quantity?: string;
  expiryDate?: string;
  productionDate?: string;
  image?: string;
}

export interface Unit {
  value: string;
  label: string;
}
