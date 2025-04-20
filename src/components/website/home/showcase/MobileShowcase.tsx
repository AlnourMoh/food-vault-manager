import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Package, ChartBar, Bell, BarcodeIcon, ShoppingCart, List, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    // الصفحة الرئيسية والتنبيهات
    <div key="home" className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">التنبيهات</h3>
          </div>
        </div>
        <Card className="p-3 bg-red-50 mb-2">
          <p className="text-sm text-red-600">منتج قارب على النفاذ: حليب طازج</p>
        </Card>
        <Card className="p-3 bg-yellow-50">
          <p className="text-sm text-yellow-600">تاريخ انتهاء قريب: جبنة بيضاء</p>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">المخزون السريع</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div>
                  <p className="font-medium">منتج {item}</p>
                  <p className="text-sm text-gray-500">متوفر: 50 قطعة</p>
                </div>
              </div>
              <button className="text-primary text-sm">تحديث</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <ChartBar className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">نظرة سريعة</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-blue-50">
            <p className="text-sm text-gray-600">المنتجات</p>
            <p className="text-xl font-bold">234</p>
          </Card>
          <Card className="p-4 bg-green-50">
            <p className="text-sm text-gray-600">تم المسح اليوم</p>
            <p className="text-xl font-bold">45</p>
          </Card>
        </div>
      </div>
    </div>,
    
    // مسح الباركود
    <div key="scan" className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarcodeIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">مسح الباركود</h3>
        </div>
        <div className="rounded-lg overflow-hidden mb-4">
          <div className="w-full aspect-video bg-gray-100 relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <BarcodeIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">قم بتوجيه الكاميرا نحو الباركود</p>
            
            <div className="absolute inset-0 flex">
              <div className="absolute top-0 h-px w-full bg-red-500 animate-pulse" style={{ top: '50%' }}></div>
            </div>
          </div>
        </div>
        
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div>
              <h4 className="font-semibold">حليب طازج</h4>
              <p className="text-sm text-gray-500">متوفر: 12 قطعة</p>
            </div>
          </div>
          <div className="flex gap-2 w-full mt-2">
            <Button className="flex-1" size="sm">تحديث المخزون</Button>
            <Button variant="outline" size="sm">التفاصيل</Button>
          </div>
        </Card>
        
        <div className="flex justify-center">
          <Button className="w-full" variant="secondary">إدخال الرمز يدوياً</Button>
        </div>
      </div>
    </div>,
    
    // المخزون
    <div key="inventory" className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">المخزون</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1">
            <input className="w-full px-3 py-2 pr-8 rounded-lg border" placeholder="بحث..." />
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <Button size="sm" variant="outline" className="ml-2">
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
          <Button size="sm" variant="secondary">الكل</Button>
          <Button size="sm" variant="outline">ألبان</Button>
          <Button size="sm" variant="outline">لحوم</Button>
          <Button size="sm" variant="outline">خضروات</Button>
          <Button size="sm" variant="outline">معلبات</Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <Card key={item} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <h4 className="font-semibold">منتج {item}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">الكمية: {50 - item * 5}</span>
                    {item % 3 === 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        منخفض
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>,
    
    // إضافة منتج
    <div key="add-product" className="w-full h-full bg-white p-4 overflow-hidden">
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
                <BarcodeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button className="w-full">إضافة المنتج</Button>
          </div>
        </form>
      </div>
    </div>
  ];

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full">
      {pages[currentPage]}
      
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={goToPrevPage}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={goToNextPage}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {pages.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${currentPage === idx ? 'bg-primary' : 'bg-gray-300'}`}
            onClick={() => setCurrentPage(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileShowcase;
