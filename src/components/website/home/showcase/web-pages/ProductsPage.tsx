
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const ProductsPage = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">إدارة المنتجات</h3>
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 relative">
            <input className="w-full pl-8 pr-3 py-2 border rounded-lg" placeholder="بحث..." />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <Button size="sm" className="bg-primary">إضافة منتج</Button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-medium">منتج {item}</p>
                  <p className="text-xs text-gray-500">متوفر: 50 قطعة</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">تعديل</Button>
                <Button variant="outline" size="sm" className="text-red-500">حذف</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
