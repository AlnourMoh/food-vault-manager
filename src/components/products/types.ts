
export interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  expiryDate: string;
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
}
