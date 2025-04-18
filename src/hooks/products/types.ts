
import { FormData, FormError } from '@/components/products/types';

export interface ProductFormHookReturn {
  formData: FormData;
  errors: FormError;
  isSubmitting: boolean;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  units: { value: string; label: string }[];
  setUnits: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (file: File | null, url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
