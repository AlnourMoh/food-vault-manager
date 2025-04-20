
import React from 'react';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, ChartBar } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="w-full h-full bg-background/95 p-4 overflow-hidden select-none pointer-events-none">
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
    </div>
  );
};

export default DashboardPage;
