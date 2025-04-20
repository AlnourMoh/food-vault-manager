
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Package, ChartBar, Bell } from 'lucide-react';

const MobileShowcase = () => {
  return (
    <div className="w-full h-full bg-white p-4 overflow-hidden">
      {/* شريط التنبيهات */}
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

      {/* المخزون السريع */}
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

      {/* الإحصائيات السريعة */}
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
    </div>
  );
};

export default MobileShowcase;
