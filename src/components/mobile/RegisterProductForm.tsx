
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegisterProductFormProps {
  onSubmit: (productData: ProductRegistrationData) => void;
  loading: boolean;
}

export interface ProductRegistrationData {
  name: string;
  barcode: string;
  category: string;
  unit: string;
}

const RegisterProductForm: React.FC<RegisterProductFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<ProductRegistrationData>({
    name: '',
    barcode: '',
    category: 'بقالة',
    unit: 'قطعة',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">اسم المنتج</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          placeholder="ادخل اسم المنتج" 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="barcode">الباركود</Label>
        <Input 
          id="barcode" 
          name="barcode" 
          value={formData.barcode} 
          onChange={handleInputChange} 
          placeholder="ادخل رمز الباركود" 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="category">التصنيف</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="بقالة">بقالة</SelectItem>
            <SelectItem value="خضروات">خضروات</SelectItem>
            <SelectItem value="لحوم">لحوم</SelectItem>
            <SelectItem value="ألبان">ألبان</SelectItem>
            <SelectItem value="معلبات">معلبات</SelectItem>
            <SelectItem value="بهارات">بهارات</SelectItem>
            <SelectItem value="أخرى">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="unit">الوحدة</Label>
        <Select
          value={formData.unit}
          onValueChange={(value) => handleSelectChange('unit', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الوحدة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="قطعة">قطعة</SelectItem>
            <SelectItem value="كيلوجرام">كيلوجرام</SelectItem>
            <SelectItem value="لتر">لتر</SelectItem>
            <SelectItem value="علبة">علبة</SelectItem>
            <SelectItem value="كرتون">كرتون</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري التسجيل..." : "تسجيل المنتج"}
      </Button>
    </form>
  );
};

export default RegisterProductForm;
