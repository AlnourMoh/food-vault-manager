
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormError } from '@/components/products/types';

interface CategorySelectorProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  formData: FormData;
  handleSelectChange: (name: string, value: string) => void;
  errors: FormError;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  setCategories, 
  formData, 
  handleSelectChange,
  errors
}) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      handleSelectChange('category', newCategory);
      setNewCategory('');
      setDialogOpen(false);
      
      toast({
        title: "تم إضافة التصنيف بنجاح",
        description: `تم إضافة تصنيف "${newCategory}" إلى قائمة التصنيفات`,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>التصنيف</Label>
      <div className="flex gap-2">
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger 
            id="category" 
            className={`flex-1 ${errors.category ? "border-destructive" : ""}`}
          >
            <SelectValue placeholder="اختر تصنيف المنتج" />
          </SelectTrigger>
          <SelectContent position="popper">
            {categories.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" title="إضافة تصنيف جديد">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة تصنيف جديد</DialogTitle>
              <DialogDescription>
                أدخل اسم التصنيف الجديد لإضافته إلى قائمة التصنيفات المتاحة
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="new-category">اسم التصنيف</Label>
              <Input 
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="أدخل اسم التصنيف الجديد"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
              <Button 
                onClick={handleAddCategory}
                className="bg-fvm-primary hover:bg-fvm-primary-light"
                disabled={!newCategory.trim()}
              >
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {errors.category && (
        <p className="text-xs text-destructive">{errors.category}</p>
      )}
    </div>
  );
};

export default CategorySelector;
