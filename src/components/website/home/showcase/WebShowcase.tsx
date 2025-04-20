
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Package, ChartBar, Users } from 'lucide-react';

const WebShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [
    // لوحة التحكم
    <div key="dashboard" className="w-full h-full bg-background/95 p-4 overflow-hidden select-none pointer-events-none">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">لوحة التحكم الرئيسية</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-secondary/30">
            <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
            <p className="text-2xl font-bold text-foreground">1,234</p>
          </Card>
          <Card className="p-4 bg-secondary/30">
            <p className="text-sm text-muted-foreground">المنتجات المتوفرة</p>
            <p className="text-2xl font-bold text-foreground">987</p>
          </Card>
          <Card className="p-4 bg-secondary/30">
            <p className="text-sm text-muted-foreground">تنبيهات المخزون</p>
            <p className="text-2xl font-bold text-foreground">12</p>
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

  const features = [
    "لوحة تحكم شاملة لعرض الإحصائيات",
    "إدارة المنتجات والمخزون بكفاءة",
    "تتبع الصلاحية والكميات",
    "تقارير وإحصائيات متقدمة",
    "إدارة المستخدمين والصلاحيات"
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-secondary/30">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 max-w-[200px]">
        {features.map((feature, index) => (
          <Button
            key={index}
            variant={currentPage === index ? "default" : "outline"}
            onClick={() => setCurrentPage(index)}
            size="sm"
            className="text-right justify-start py-1 text-xs"
          >
            {feature}
          </Button>
        ))}
      </div>
      {pages[currentPage]}
    </div>
  );
};

export default WebShowcase;
