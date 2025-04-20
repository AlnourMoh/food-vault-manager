
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Package, ChartBar, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WebShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    // لوحة التحكم
    <div key="dashboard" className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">لوحة التحكم الرئيسية</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-50">
            <p className="text-sm text-gray-600">إجمالي المنتجات</p>
            <p className="text-2xl font-bold">1,234</p>
          </Card>
          <Card className="p-4 bg-green-50">
            <p className="text-sm text-gray-600">المنتجات المتوفرة</p>
            <p className="text-2xl font-bold">987</p>
          </Card>
          <Card className="p-4 bg-yellow-50">
            <p className="text-sm text-gray-600">تنبيهات المخزون</p>
            <p className="text-2xl font-bold">12</p>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartBar className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">تقارير وإحصائيات</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            رسم بياني للمبيعات
          </div>
          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            إحصائيات المخزون
          </div>
        </div>
      </div>
    </div>,
    
    // إدارة المنتجات
    <div key="products" className="w-full h-full bg-white p-4 overflow-hidden">
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
    </div>,
    
    // تتبع المخزون
    <div key="inventory" className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">تتبع المخزون</h3>
        </div>
        <div className="flex justify-between mb-4">
          <div className="space-x-2 flex">
            <Button variant="outline" size="sm" className="ml-2">الكل</Button>
            <Button variant="outline" size="sm" className="ml-2">منخفض المخزون</Button>
            <Button variant="outline" size="sm">منتهي الصلاحية</Button>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-right">اسم المنتج</th>
                <th className="p-3 text-right">الكمية</th>
                <th className="p-3 text-right">تاريخ الصلاحية</th>
                <th className="p-3 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-t">
                  <td className="p-3">منتج {item}</td>
                  <td className="p-3">{30 - item * 5} قطعة</td>
                  <td className="p-3">20/06/2025</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${item % 3 === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item % 3 === 0 ? 'منخفض' : 'متوفر'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    
    // إدارة المستخدمين
    <div key="users" className="w-full h-full bg-white p-4 overflow-hidden">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/2 relative">
            <input className="w-full pl-8 pr-3 py-2 border rounded-lg" placeholder="بحث بالاسم..." />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <Button size="sm" className="bg-primary">إضافة مستخدم</Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-right">الاسم</th>
                <th className="p-3 text-right">البريد الإلكتروني</th>
                <th className="p-3 text-right">الدور</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "أحمد محمد", email: "ahmed@example.com", role: "مدير" },
                { name: "محمد علي", email: "mohamed@example.com", role: "مشرف مخزون" },
                { name: "فاطمة أحمد", email: "fatima@example.com", role: "موظف مخزون" },
                { name: "خالد محمود", email: "khaled@example.com", role: "مدير مبيعات" },
              ].map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">تعديل</Button>
                      <Button variant="outline" size="sm" className="text-red-500">حذف</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      
      <div className="absolute bottom-2 right-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={goToPrevPage}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToNextPage}>
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

export default WebShowcase;
