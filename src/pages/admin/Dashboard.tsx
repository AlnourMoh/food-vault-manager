
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BuildingIcon, Users, ShoppingCart, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // التحقق من تسجيل دخول المسؤول
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLogin') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // بيانات إحصائية نموذجية - في التطبيق الحقيقي، ستأتي من قاعدة البيانات
  const stats = [
    {
      title: "المطاعم",
      value: "12",
      icon: <BuildingIcon className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "المستخدمين",
      value: "48",
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "المنتجات",
      value: "156",
      icon: <ShoppingCart className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "التقارير",
      value: "24",
      icon: <BarChart className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50"
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
        
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
              <CardTitle>آخر المطاعم المضافة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>مطعم البيت العربي</span>
                  <span className="text-gray-600">منذ يومين</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>مطعم الأصيل</span>
                  <span className="text-gray-600">منذ 3 أيام</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>مطعم القصر</span>
                  <span className="text-gray-600">منذ أسبوع</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>تقارير النشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>تسجيل دخول جديد</span>
                  <span className="text-gray-600">اليوم 10:30</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>إضافة منتجات</span>
                  <span className="text-gray-600">اليوم 09:15</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>تحديث مخزون</span>
                  <span className="text-gray-600">أمس 14:45</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
