
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

const AddProducts = () => {
  const { restaurants } = getMockData();
  const { toast } = useToast();
  
  // State for categories
  const [categories, setCategories] = useState([
    'بقالة',
    'لحوم',
    'ألبان',
    'خضروات',
    'فواكه',
    'بهارات',
    'زيوت',
    'مجمدات',
  ]);
  
  // State for new category
  const [newCategory, setNewCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    expiryDate: '',
    restaurantId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "تم إضافة المنتج بنجاح",
      description: `تم إضافة ${formData.name} إلى المخزون`,
    });
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      unit: '',
      quantity: '',
      expiryDate: '',
      restaurantId: '',
    });
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setDialogOpen(false);
      
      toast({
        title: "تم إضافة التصنيف بنجاح",
        description: `تم إضافة تصنيف "${newCategory}" إلى قائمة التصنيفات`,
      });
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">إدخال المنتجات</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">إضافة منتج جديد</CardTitle>
            <CardDescription>أدخل بيانات المنتج الجديد لإضافته إلى المخزون</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المنتج</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="أدخل اسم المنتج" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category" className="flex-1">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">وحدة القياس</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => handleSelectChange('unit', value)}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="اختر وحدة القياس" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="kg">كيلوغرام</SelectItem>
                      <SelectItem value="g">غرام</SelectItem>
                      <SelectItem value="l">لتر</SelectItem>
                      <SelectItem value="ml">مليلتر</SelectItem>
                      <SelectItem value="piece">قطعة</SelectItem>
                      <SelectItem value="box">صندوق</SelectItem>
                      <SelectItem value="pack">عبوة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    type="number" 
                    min="0" 
                    placeholder="أدخل الكمية" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
                  <Input 
                    id="expiryDate" 
                    name="expiryDate" 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restaurant">المطعم</Label>
                  <Select 
                    value={formData.restaurantId} 
                    onValueChange={(value) => handleSelectChange('restaurantId', value)}
                  >
                    <SelectTrigger id="restaurant">
                      <SelectValue placeholder="اختر المطعم" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">إلغاء</Button>
            <Button 
              type="submit" 
              form="add-product-form" 
              className="bg-fvm-primary hover:bg-fvm-primary-light"
            >
              إضافة المنتج
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddProducts;
