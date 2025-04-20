
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Package, ChartBar, Users } from 'lucide-react';

const WebShowcase = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      {/* لوحة التحكم */}
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

      {/* الرسوم البيانية */}
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

      {/* المستخدمين */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((user) => (
            <div key={user} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div>
                <p className="font-medium">مستخدم {user}</p>
                <p className="text-sm text-gray-500">مدير مخزون</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebShowcase;
