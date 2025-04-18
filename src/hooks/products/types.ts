
import { FormData, FormError, Unit } from '@/components/products/types';

export interface ProductFormHookReturn {
  formData: FormData;
  errors: FormError;
  isSubmitting: boolean;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (file: File | null, url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
