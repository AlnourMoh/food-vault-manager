
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

const MobileDashboard = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: 'إدخال منتج',
      description: 'إضافة منتج جديد للمخزون بعد مسح الباركود',
      icon: <ArrowDown className="h-8 w-8 text-green-500" />,
      path: '/restaurant/mobile/add'
    },
    {
      title: 'إخراج منتج',
      description: 'إخراج منتج من المخزون بعد مسح الباركود',
      icon: <ArrowUp className="h-8 w-8 text-red-500" />,
      path: '/restaurant/mobile/remove'
    }
  ];

  return (
    <RestaurantLayout>
      <div className="rtl space-y-6 px-4">
        <h1 className="text-2xl font-bold tracking-tight">تطبيق إدارة المخزون</h1>
        
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default MobileDashboard;
