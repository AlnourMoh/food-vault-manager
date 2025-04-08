
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

const AddProducts = () => {
  const { restaurants } = getMockData();
  const { toast } = useToast();
  
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
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="اختر تصنيف المنتج" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="groceries">بقالة</SelectItem>
                      <SelectItem value="meat">لحوم</SelectItem>
                      <SelectItem value="dairy">ألبان</SelectItem>
                      <SelectItem value="vegetables">خضروات</SelectItem>
                      <SelectItem value="fruits">فواكه</SelectItem>
                      <SelectItem value="spices">بهارات</SelectItem>
                      <SelectItem value="oils">زيوت</SelectItem>
                      <SelectItem value="frozen">مجمدات</SelectItem>
                    </SelectContent>
                  </Select>
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
