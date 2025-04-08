
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getMockData } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

const Restaurants = () => {
  const { restaurants } = getMockData();

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">المطاعم</h1>
          <Button className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة مطعم جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة المطاعم</CardTitle>
            <CardDescription>قائمة بجميع المطاعم المسجلة في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المطعم</TableHead>
                  <TableHead className="text-right">المدير</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell>{restaurant.manager}</TableCell>
                    <TableCell>{restaurant.address}</TableCell>
                    <TableCell>{restaurant.phone}</TableCell>
                    <TableCell>{restaurant.email}</TableCell>
                    <TableCell>
                      {new Date(restaurant.registrationDate).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      {restaurant.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          غير نشط
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Restaurants;
