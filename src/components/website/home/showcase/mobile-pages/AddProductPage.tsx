
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddProductPage = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">إضافة منتج</h3>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج</label>
            <input className="w-full px-3 py-2 border rounded-lg" placeholder="أدخل اسم المنتج" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">الفئة</label>
            <select className="w-full px-3 py-2 border rounded-lg bg-white">
              <option>ألبان</option>
              <option>لحوم</option>
              <option>خضروات</option>
              <option>معلبات</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">الكمية</label>
            <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="أدخل الكمية" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">تاريخ الصلاحية</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">الباركود</label>
            <div className="flex gap-2">
              <input className="flex-1 px-3 py-2 border rounded-lg" placeholder="أدخل رقم الباركود" />
              <Button type="button" variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button className="w-full">إضافة المنتج</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
