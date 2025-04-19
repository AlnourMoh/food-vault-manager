
import React from 'react';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

const RestaurantDashboard = () => {
  // Mock data - in a real app, this would come from the database
  const stats = [
    {
      title: "إجمالي المنتجات",
      value: "153",
      icon: <ShoppingCart className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "أعضاء الفريق",
      value: "12",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "المخزون الحالي",
      value: "856 كجم",
      icon: <Archive className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "منتجات منتهية",
      value: "8",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      color: "bg-red-50"
    }
  ];

  return (
    <RestaurantLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مرحباً بك في لوحة تحكم المطعم</h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className={`flex flex-row items-center justify-between pb-2 ${stat.color} rounded-t-lg`}>
                <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>آخر المنتجات المضافة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">لا توجد منتجات مضافة حديثاً</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
